import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { formatDate } from "../utils/dateUtils";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import LoadingOverlay from "../components/layout/LoadingOverlay";
import CustomCalendar from "../components/calendar/CustomCalendar";
import EventsList from "../components/events/EventsList";
import StatsCards from "../components/dashboard/StatsCard";

export default function ScheduleCalendar({ onRefresh }) {
  const { user, logout, startAuth } = useAuth();
  const { appointments, loading, fetchAppointments } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🔹 Re-fetch appointments when refreshCounter changes
  useEffect(() => {
    if (onRefresh !== undefined) {
      fetchAppointments();
    }
  }, [onRefresh]); // depends on refreshCounter

  const eventDates = appointments.map((event) =>
    event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date))
  );

  const eventsForSelectedDate = appointments.filter((event) => {
    const eventDate = event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date));
    return eventDate === formatDate(selectedDate);
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          loading={loading}
          onRefresh={fetchAppointments}
          onAuth={startAuth}
        />
        <main className="flex-1 overflow-auto p-6">
          {user ? (
            <>
              <StatsCards appointments={appointments} />

              {/* ✅ Calendar + Events */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Calendar */}
                <div className="lg:col-span-3">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    eventDates={eventDates}
                    loading={loading}
                  />
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* ✅ Selected Date Card */}
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Selected Date
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Events List */}
                  <EventsList events={eventsForSelectedDate} loading={loading} />
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-md py-12 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <CalendarDays className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Welcome to Calendar
              </h3>
              <p className="mb-8 text-gray-600">
                Connect your Google account to view and manage your
                appointments.
              </p>
              <button
                onClick={startAuth}
                disabled={loading}
                className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Get Started
              </button>
            </div>
          )}
        </main>
      </div>
      {loading && <LoadingOverlay message="Loading your calendar..." />}
    </div>
  );
}
