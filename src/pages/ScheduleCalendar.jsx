import { useState, useEffect } from "react";
import {
  CalendarDays,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { useCalendars } from "../hooks/useCalendars";
import { useNotifications } from "../hooks/useNotifications";
import { formatDate } from "../utils/dateUtils";

import Header from "../components/layout/Header";
import LoadingOverlay from "../components/layout/LoadingOverlay";
import CustomCalendar from "../components/calendar/CustomCalendar";
import EventsList from "../components/events/EventsList";
import StatsCards from "../components/dashboard/StatsCard";
import {
  NotificationBell,
  NotificationDropdown,
} from "../components/notifications";

export default function ScheduleCalendar({ onRefresh }) {
  const { user, logout, startAuth } = useAuth();
  const { appointments, loading, fetchAppointments } = useAppointments();
  const { calendars } = useCalendars();
  const { todayAppointments, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(appointments);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendar, setSelectedCalendar] = useState("primary");
  const [showNotifications, setShowNotifications] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (user) fetchAppointments(selectedCalendar);
  }, [selectedCalendar, user]);

  // Re-fetch on refresh
  useEffect(() => {
    if (onRefresh !== undefined) {
      fetchAppointments(selectedCalendar);
    }
  }, [onRefresh]);

  const eventDates = appointments.map((event) =>
    event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date)),
  );

  const eventsForSelectedDate = appointments.filter((event) => {
    const eventDate = event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date));
    return eventDate === formatDate(selectedDate);
  });

  const handleNotificationClick = (appointment) => {
    markAsRead(appointment.id);
    const appointmentDate = appointment.start?.dateTime
      ? new Date(appointment.start.dateTime)
      : new Date(appointment.start.date);
    setSelectedDate(appointmentDate);
  };

  function emailToName(emailOrSummary) {
    if (!emailOrSummary) return "";

    // If it’s an email, take the part before @, otherwise just use summary directly
    const raw = emailOrSummary.includes("@")
      ? emailOrSummary.split("@")[0] // before the @
      : emailOrSummary;

    // Replace dots/underscores with spaces, then capitalize each word
    return raw
      .replace(/[._-]+/g, " ") // turn . or _ or - into space
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Top Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            {/* LEFT SIDE: Clean Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-light tracking-tight text-teal sm:text-3xl">
                Calendar
              </h1>
              <div className="h-0.5 w-8 bg-teal"></div>
            </div>

            {/* RIGHT SIDE: Calendar Selector + Notifications + User */}
            {user && (
              <div className="flex items-center space-x-8">
                {/* Calendar Selector */}
                {calendars.length > 0 && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="calendarSelect"
                      className="letter-spacing-widest text-xs font-medium tracking-wide text-gray-500 uppercase"
                    >
                      Active Calendar
                    </label>
                    <div className="relative">
                      <select
                        id="calendarSelect"
                        value={selectedCalendar}
                        onChange={(e) => setSelectedCalendar(e.target.value)}
                        className="block w-full min-w-48 appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 pr-8 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-gray-400 focus:border-gray-900 focus:ring-0 focus:outline-none"
                      >
                        {calendars.map((cal) => (
                          <option
                            key={cal.id}
                            value={cal.id}
                            className="bg-white text-gray-900"
                          >
                            {emailToName(cal.summary)}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <NotificationBell
                    unreadCount={unreadCount}
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      markAllAsRead();
                    }}
                    className="rounded-full bg-gray-50 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  />
                  {showNotifications && (
                    <NotificationDropdown
                      todayAppointments={todayAppointments}
                      onClose={() => setShowNotifications(false)}
                      onNotificationClick={handleNotificationClick}
                    />
                  )}
                </div>

                <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-xs font-medium text-white">
                    {user.name?.charAt(0) || <User size={14} />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 border-l border-gray-200 pl-6 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Header
        user={user}
        loading={loading}
        onRefresh={() => fetchAppointments(selectedCalendar)}
        onAuth={startAuth}
      />

      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* MAIN */}
      <main className="p-4 sm:p-6">
        {user ? (
          <>
            <StatsCards appointments={appointments} />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <CustomCalendar
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  eventDates={eventDates}
                  loading={loading}
                />
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
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
                <EventsList events={eventsForSelectedDate} loading={loading} />
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-md py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CalendarDays className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Welcome to Calendar
            </h3>
            <p className="mb-8 text-gray-600">
              Connect your Google account to view and manage your appointments.
            </p>
            <button
              onClick={startAuth}
              disabled={loading}
              className="inline-flex items-center border-b-2 border-gray-900 bg-transparent px-0 py-2 text-base font-medium text-gray-900 transition-colors hover:text-gray-600 disabled:opacity-50"
            >
              Get Started
            </button>
          </div>
        )}
      </main>

      {loading && <LoadingOverlay message="Loading your calendar..." />}

      <style jsx>{`
        .letter-spacing-widest {
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
