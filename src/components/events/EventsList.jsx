// src/components/events/EventsList.jsx
import { useState, useEffect, useMemo } from "react";
import { Clock, CalendarDays } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";

export default function EventsList({ events = [], loading }) {
  const [page, setPage] = useState(1);
  const eventsPerPage = 2;

  // Helper: determine event status using end time for "past"
  const getEventStatus = (event) => {
    const now = new Date();
    const start = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : new Date(event.start?.date);
    const end = event.end?.dateTime
      ? new Date(event.end.dateTime)
      : new Date(event.end?.date || event.start?.date);

    if (end < now) return "past";
    if (start.toDateString() === now.toDateString()) return "today";
    return "upcoming";
  };

  // Helper: hide weird group calendar emails and prefer displayName
  const getOrganizerName = (organizer) => {
    if (!organizer) return null;
    const displayName = organizer.displayName?.trim();
    const email = organizer.email?.trim();
    const isWeirdEmail =
      email &&
      email.startsWith("c_") &&
      email.endsWith("@group.calendar.google.com");

    if (displayName) return displayName;
    if (email && !isWeirdEmail) return email;
    return null;
  };

  // Memoized sorted events by start time
  const sortedByStart = useMemo(() => {
    return [...events].sort((a, b) => {
      const startA = new Date(a.start?.dateTime || a.start?.date).getTime();
      const startB = new Date(b.start?.dateTime || b.start?.date).getTime();
      return startA - startB;
    });
  }, [events]);

  // Order statuses: today (0), upcoming (1), past (2) -> past goes last
  const statusOrder = { today: 0, upcoming: 1, past: 2 };

  // Group/sort so today/upcoming come first, then past — preserve chronological inside groups
  const visibleEvents = useMemo(() => {
    return [...sortedByStart].sort((a, b) => {
      const sa = getEventStatus(a);
      const sb = getEventStatus(b);
      const orderDiff = statusOrder[sa] - statusOrder[sb];
      if (orderDiff !== 0) return orderDiff;

      // same status -> order by start time
      const startA = new Date(a.start?.dateTime || a.start?.date).getTime();
      const startB = new Date(b.start?.dateTime || b.start?.date).getTime();
      return startA - startB;
    });
  }, [sortedByStart]); // getEventStatus reads nothing external so safe

  const totalPages = Math.ceil(visibleEvents.length / eventsPerPage) || 0;

  // Reset page when the events prop changes (e.g. when selecting another date)
  useEffect(() => {
    setPage(1);
  }, [events]);

  // Clamp page if totalPages shrinks below current page
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [totalPages, page]);

  const paginatedEvents = visibleEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  const getBadgeColor = (status) => {
    switch (status) {
      case "today":
        return "bg-green-100 text-green-700";
      case "past":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white shadow-sm px-6 py-4 animate-pulse"
          >
            <div className="h-4 w-40 rounded bg-gray-300 mb-2"></div>
            <div className="h-3 w-28 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!visibleEvents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 shadow-inner">
          <CalendarDays className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          No events scheduled for this date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedEvents.map((event) => {
          const status = getEventStatus(event);
          const organizerText = getOrganizerName(event.organizer);

          return (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm px-6 py-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900 break-words">
                    {(event.summary || "Untitled Event")
                      .replace(/[()]/g, "")
                      .trim()}
                  </p>

                  {organizerText && (
                    <p className="mt-0.5 text-xs text-gray-600">
                      Booked by{" "}
                      <span className="font-medium text-gray-800">
                        {organizerText}
                      </span>
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor(
                    status
                  )}`}
                >
                  {status === "today" ? "Today" : status === "past" ? "Past" : "Upcoming"}
                </span>
              </div>

              {/* Time */}
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1 text-gray-400" />
                <span>
                  {event.start?.dateTime
                    ? formatTime(event.start.dateTime)
                    : "All day"}
                </span>
                {event.end?.dateTime && (
                  <span className="ml-1">– {formatTime(event.end.dateTime)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
