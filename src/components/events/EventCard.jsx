import { Clock } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";
import { stripHTML } from "../../utils/htmlUtils";

export default function EventCard({ event }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
      <h4 className="mb-1 font-medium text-gray-900">
        {event.summary || "Untitled Event"}
      </h4>
      {event.description && (
        <p className="mb-2 text-sm text-gray-600">
          {stripHTML(event.description)}
        </p>
      )}
      <div className="flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>
            {event.start?.dateTime
              ? formatTime(event.start.dateTime)
              : "All day"}
          </span>
        </div>
        {event.end?.dateTime && <span>- {formatTime(event.end.dateTime)}</span>}
      </div>
    </div>
  );
}
