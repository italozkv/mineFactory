import { ROADMAP_STATUS_ORDER, getRoadmapStatusLabel } from '../../../utils/roadmapUtils.js';
import { groupRoadmapItemsByStatus } from '../../../services/roadmapService.js';
import RoadmapColumn from './RoadmapColumn.jsx';

export default function RoadmapBoard({ items, onEdit, onDelete, onMove }) {
  const grouped = groupRoadmapItemsByStatus(items);

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="grid min-w-[1120px] gap-4 xl:grid-cols-4">
        {ROADMAP_STATUS_ORDER.map((status) => (
          <RoadmapColumn
            key={status}
            title={getRoadmapStatusLabel(status)}
            count={grouped[status].length}
            items={grouped[status]}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}
