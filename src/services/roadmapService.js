import { supabase } from '../lib/supabaseClient.js';
import { isArchivedProject } from '../utils/formatters.js';
import {
  ROADMAP_DEFAULT_FORM,
  ROADMAP_STATUS_ORDER,
  isValidRoadmapPriority,
  isValidRoadmapStatus,
  isValidRoadmapType,
  normalizeRoadmapItem,
  textValue,
  normalizeRoadmapImportItem,
} from '../utils/roadmapUtils.js';

function buildStatusTimestamps(status, previous = {}) {
  const now = new Date().toISOString();

  if (status === 'completed') {
    return {
      completed_at: previous.completed_at || now,
      cancelled_at: null,
    };
  }

  if (status === 'cancelled') {
    return {
      completed_at: null,
      cancelled_at: previous.cancelled_at || now,
    };
  }

  return {
    completed_at: null,
    cancelled_at: null,
  };
}

function normalizePayload(data, previous = {}) {
  const merged = { ...ROADMAP_DEFAULT_FORM, ...previous, ...data };
  const status = isValidRoadmapStatus(merged.status) ? merged.status : ROADMAP_DEFAULT_FORM.status;
  const priority = isValidRoadmapPriority(merged.priority) ? merged.priority : ROADMAP_DEFAULT_FORM.priority;
  const type = isValidRoadmapType(merged.type) ? merged.type : ROADMAP_DEFAULT_FORM.type;
  const timestamps = buildStatusTimestamps(status, previous);

  return {
    project_id: merged.project_id || null,
    title: textValue(merged.title),
    description: textValue(merged.description) || null,
    status,
    priority,
    type,
    category: textValue(merged.category) || null,
    target_version: textValue(merged.target_version) || null,
    is_public: Boolean(merged.is_public),
    sort_order: Number.isFinite(Number(merged.sort_order)) ? Number(merged.sort_order) : 0,
    completed_at: merged.completed_at ?? timestamps.completed_at,
    cancelled_at: merged.cancelled_at ?? timestamps.cancelled_at,
  };
}

export async function listProjectsForSelect() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, slug, visibility')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data || []).filter((project) => !isArchivedProject(project));
}

export async function listRoadmapItems(filters = {}) {
  let query = supabase
    .from('roadmap_items')
    .select('*, project:projects(id, name, slug)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (filters.search) query = query.ilike('title', `%${filters.search}%`);
  if (filters.projectId) query = query.eq('project_id', filters.projectId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.priority) query = query.eq('priority', filters.priority);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.category) query = query.ilike('category', `%${filters.category}%`);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(normalizeRoadmapItem);
}

export async function getRoadmapItem(id) {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*, project:projects(id, name, slug)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return normalizeRoadmapItem(data);
}

export async function createRoadmapItem(data) {
  const payload = normalizePayload(data);
  const { data: inserted, error } = await supabase.from('roadmap_items').insert(payload).select('id').single();

  if (error) throw error;
  return getRoadmapItem(inserted.id);
}

export async function updateRoadmapItem(id, data) {
  const previous = await getRoadmapItem(id);
  const payload = normalizePayload(data, previous);
  const { error } = await supabase.from('roadmap_items').update(payload).eq('id', id);

  if (error) throw error;
  return getRoadmapItem(id);
}

export async function deleteRoadmapItem(id) {
  const { error } = await supabase.from('roadmap_items').delete().eq('id', id);
  if (error) throw error;
}

export async function moveRoadmapItem(id, status) {
  const previous = await getRoadmapItem(id);
  const payload = normalizePayload({ status }, previous);
  const { error } = await supabase
    .from('roadmap_items')
    .update({
      status: payload.status,
      completed_at: payload.completed_at,
      cancelled_at: payload.cancelled_at,
    })
    .eq('id', id);

  if (error) throw error;
  return getRoadmapItem(id);
}

export function groupRoadmapItemsByStatus(items) {
  return ROADMAP_STATUS_ORDER.reduce((acc, status) => {
    acc[status] = items.filter((item) => item.status === status);
    return acc;
  }, {});
}

export async function importRoadmapItems(items) {
  const projectOptions = await listProjectsForSelect();
  const normalizedItems = Array.isArray(items) ? items.map(normalizeRoadmapImportItem) : [];
  const projectLookup = new Map(projectOptions.map((project) => [project.name.trim().toLowerCase(), project]));
  const warnings = [];
  const payloads = normalizedItems.map((item, index) => {
    let projectId = null;

    if (item.project) {
      const matchedProject = projectLookup.get(item.project.toLowerCase());
      if (matchedProject) {
        projectId = matchedProject.id;
      } else {
        warnings.push(`Item ${index + 1}: projeto "${item.project}" nao encontrado.`);
      }
    }

    return {
      project_id: projectId,
      title: item.title,
      description: item.description,
      status: isValidRoadmapStatus(item.status) ? item.status : 'planned',
      priority: isValidRoadmapPriority(item.priority) ? item.priority : 'medium',
      type: isValidRoadmapType(item.type) ? item.type : 'feature',
      category: item.category,
      target_version: item.target_version,
      is_public: Boolean(item.is_public),
    };
  });

  const validPayloads = payloads.filter((item) => item.title);
  if (validPayloads.length === 0) {
    throw new Error('Nenhuma tarefa valida para importar.');
  }

  const { data, error } = await supabase.from('roadmap_items').insert(validPayloads).select('id');
  if (error) throw error;

  return {
    createdCount: data?.length || 0,
    warnings,
  };
}
