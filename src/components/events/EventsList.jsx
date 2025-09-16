import { CalendarDays, Plus } from "lucide-react";
import EventCard from "./EventCard";

export default function EventsList({ events, loading }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Events</h3>
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
          <Plus size={16} />
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-500">No events scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
