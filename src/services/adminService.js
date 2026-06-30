import { supabase } from '../lib/supabaseClient.js';
import { DEFAULT_PROJECT_FORM } from '../constants/projects.js';
import { isArchivedProject, slugify } from '../utils/formatters.js';

const PROJECT_SELECT = `
  *,
  categories(id, name, slug),
  project_tags(tags(id, name, slug, color))
`;

function textValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePayload(payload) {
  const merged = { ...DEFAULT_PROJECT_FORM, ...payload };
  const name = textValue(merged.name);
  const slugSource = textValue(merged.slug) || name;
  const shortDescription = textValue(merged.short_description);
  const description = textValue(merged.description);
  const logoUrl = textValue(merged.logo_url);
  const bannerUrl = textValue(merged.banner_url);
  const externalLinks = arrayValue(merged.external_links);

  return {
    name,
    slug: slugify(slugSource),
    short_description: shortDescription,
    description,
    logo_url: logoUrl || null,
    banner_url: bannerUrl || null,
    status: merged.status,
    category_id: merged.category_id || null,
    minecraft_versions: arrayValue(merged.minecraft_versions),
    loaders: arrayValue(merged.loaders),
    visibility: merged.visibility,
    is_published: Boolean(merged.is_published),
    external_links: externalLinks
      .map((link) => ({
        label: textValue(link?.label),
        url: textValue(link?.url),
      }))
      .filter((link) => link.label.length > 0 && link.url.length > 0),
  };
}

async function syncProjectTags(projectId, tagIds) {
  const ids = [...new Set(tagIds.filter(Boolean))];

  const { error: deleteError } = await supabase.from('project_tags').delete().eq('project_id', projectId);
  if (deleteError) throw deleteError;

  if (ids.length === 0) return;

  const rows = ids.map((tagId) => ({ project_id: projectId, tag_id: tagId }));
  const { error } = await supabase.from('project_tags').insert(rows);
  if (error) throw error;
}

export async function listProjects(filters = {}) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('projects').select(PROJECT_SELECT, { count: 'exact' }).order('updated_at', {
    ascending: false,
  });

  if (filters.search) query = query.ilike('name', `%${filters.search}%`);
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.minecraftVersion) query = query.contains('minecraft_versions', [filters.minecraftVersion]);
  if (filters.loader) query = query.contains('loaders', [filters.loader]);

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return { data: data || [], count: count || 0 };
}

export async function listRecentProjects(limit = 6) {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getProject(id) {
  const { data, error } = await supabase.from('projects').select(PROJECT_SELECT).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProject(payload) {
  const tagIds = payload.tag_ids || [];
  const { data, error } = await supabase.from('projects').insert(normalizePayload(payload)).select('id').single();
  if (error) throw error;

  await syncProjectTags(data.id, tagIds);
  return getProject(data.id);
}

export async function updateProject(id, payload) {
  const tagIds = payload.tag_ids || [];
  const { error } = await supabase.from('projects').update(normalizePayload(payload)).eq('id', id);
  if (error) throw error;

  await syncProjectTags(id, tagIds);
  return getProject(id);
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateProject(id) {
  const project = await getProject(id);
  const copyName = `${project.name} Copia`;
  const payload = {
    ...project,
    name: copyName,
    slug: `${project.slug}-copia-${Date.now().toString().slice(-5)}`,
    visibility: 'private',
    is_published: false,
    tag_ids: project.project_tags?.map((item) => item.tags?.id).filter(Boolean) || [],
  };

  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.categories;
  delete payload.project_tags;

  return createProject(payload);
}

export async function archiveProject(id) {
  const { error } = await supabase
    .from('projects')
    .update({ status: 'archived', is_published: false, archived_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function setProjectPublished(id, isPublished) {
  const { error } = await supabase.from('projects').update({ is_published: isPublished }).eq('id', id);
  if (error) throw error;
}

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function listCategoriesWithCounts() {
  const [categoriesResult, projectsResult] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('projects').select('category_id'),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (projectsResult.error) throw projectsResult.error;

  const counts = (projectsResult.data || []).reduce((acc, project) => {
    if (project.category_id) acc[project.category_id] = (acc[project.category_id] || 0) + 1;
    return acc;
  }, {});

  return (categoriesResult.data || []).map((category) => ({
    ...category,
    projects_count: counts[category.id] || 0,
  }));
}

export async function createCategory(payload) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: textValue(payload.name), slug: slugify(textValue(payload.slug) || textValue(payload.name)) })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id, payload) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: textValue(payload.name), slug: slugify(textValue(payload.slug) || textValue(payload.name)) })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { count, error: countError } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) throw countError;
  if (count > 0) {
    throw new Error('Esta categoria ainda possui projetos vinculados.');
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function listTags() {
  const { data, error } = await supabase.from('tags').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function listTagsWithCounts() {
  const [tagsResult, relationsResult] = await Promise.all([
    supabase.from('tags').select('*').order('name'),
    supabase.from('project_tags').select('tag_id'),
  ]);

  if (tagsResult.error) throw tagsResult.error;
  if (relationsResult.error) throw relationsResult.error;

  const counts = (relationsResult.data || []).reduce((acc, relation) => {
    acc[relation.tag_id] = (acc[relation.tag_id] || 0) + 1;
    return acc;
  }, {});

  return (tagsResult.data || []).map((tag) => ({ ...tag, projects_count: counts[tag.id] || 0 }));
}

export async function createTag(payload) {
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: textValue(payload.name),
      slug: slugify(textValue(payload.slug) || textValue(payload.name)),
      color: textValue(payload.color) || '#22c55e',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTag(id, payload) {
  const { data, error } = await supabase
    .from('tags')
    .update({
      name: textValue(payload.name),
      slug: slugify(textValue(payload.slug) || textValue(payload.name)),
      color: textValue(payload.color) || '#22c55e',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTag(id) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const [projectsResult, categoriesResult, tagsResult] = await Promise.all([
    supabase.from('projects').select('id, name, status, visibility, is_published, created_at, updated_at'),
    supabase.from('categories').select('id'),
    supabase.from('tags').select('id'),
  ]);

  if (projectsResult.error) throw projectsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;
  if (tagsResult.error) throw tagsResult.error;

  const projects = projectsResult.data || [];
  const createdByMonth = projects.reduce((acc, project) => {
    const date = new Date(project.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthlyProjects = Object.entries(createdByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, count]) => ({ key, count, date: new Date(`${key}-01T00:00:00`) }));

  const sortedProjects = [...projects].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return {
    totalProjects: projects.length,
    publicProjects: projects.filter((project) => project.visibility === 'public' && project.is_published).length,
    privateProjects: projects.filter((project) => project.visibility === 'private' || !project.is_published).length,
    developmentProjects: projects.filter((project) => project.status === 'development').length,
    finishedProjects: projects.filter((project) => project.status === 'release').length,
    totalCategories: categoriesResult.data?.length || 0,
    totalTags: tagsResult.data?.length || 0,
    lastCreatedProject: [...projects].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null,
    recentProjects: sortedProjects.slice(0, 6),
    monthlyProjects,
  };
}

export async function uploadProjectAsset(file, folder = 'projects') {
  const extension = file.name.split('.').pop();
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('project-assets').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('project-assets').getPublicUrl(path);
  return data.publicUrl;
}

export async function listPublicProjects(filters = {}) {
  let query = supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('visibility', 'public')
    .order('updated_at', { ascending: false });

  if (filters.search) query = query.ilike('name', `%${filters.search}%`);
  if (filters.loader) query = query.contains('loaders', [filters.loader]);
  if (filters.minecraftVersion) query = query.contains('minecraft_versions', [filters.minecraftVersion]);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).filter((project) => !isArchivedProject(project));
}

export async function getPublicProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single();

  if (error) throw error;
  if (isArchivedProject(data)) {
    throw new Error('Projeto nao encontrado.');
  }
  return data;
}
