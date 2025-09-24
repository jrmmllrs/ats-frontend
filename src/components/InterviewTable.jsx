import { useState, useEffect } from "react";
import { CalendarDays, ChevronDown, Briefcase, Clock, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { useCalendars } from "../hooks/useCalendars";
import LoadingOverlay from "../components/layout/LoadingOverlay";
import EventCard from "../components/events/EventCard";

export default function InterviewTable({ onRefresh }) {
  const { user, startAuth } = useAuth() || {};
  const {
    appointments = [],
    loading = false,
    fetchAppointments,
  } = useAppointments() || {};
  const { calendars = [] } = useCalendars() || {};

  const [selectedCalendar, setSelectedCalendar] = useState("primary");

  useEffect(() => {
    if (user && fetchAppointments) {
      fetchAppointments(selectedCalendar);
    }
  }, [selectedCalendar, user]);

  useEffect(() => {
    if (onRefresh !== undefined && fetchAppointments) {
      fetchAppointments(selectedCalendar);
    }
  }, [onRefresh]);

  // Filter: only next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  const upcomingAppointments = appointments.filter((event) => {
    const startDate = new Date(event.start?.dateTime || event.start?.date);
    return startDate >= today && startDate <= nextWeek;
  });

  // Group by Date
  const eventsByDate = upcomingAppointments.reduce((acc, event) => {
    const dateKey = new Date(
      event.start?.dateTime || event.start?.date
    ).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  function emailToName(emailOrSummary) {
    if (!emailOrSummary) return "";

    // Handle special calendar names
    if (emailOrSummary.includes("@group.calendar.google.com")) {
      return "Talentscout Calendar";
    }

    if (emailOrSummary.toLowerCase().includes("talentscout")) {
      return "Talentscout";
    }

    const raw = emailOrSummary.includes("@")
      ? emailOrSummary.split("@")[0]
      : emailOrSummary;

    return raw
      .replace(/[._-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // Calculate stats
  const todayEvents = upcomingAppointments.filter((event) => {
    const eventDate = new Date(event.start?.dateTime || event.start?.date);
    return eventDate.toDateString() === today.toDateString();
  });

  const thisWeekEvents = upcomingAppointments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50">
      {/* Enhanced Header with Teal Theme */}
      <div className="border-b border-teal-100/50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            {/* LEFT SIDE: Enhanced Title */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
                    Interview Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">Manage your upcoming interviews</p>
                </div>
              </div>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
            </div>

            {/* RIGHT SIDE: Calendar Selector */}
            {user && calendars.length > 0 && (
              <div className="space-y-2">
                <label
                  htmlFor="calendarSelect"
                  className="text-xs font-medium tracking-wide text-slate-500 uppercase"
                >
                  Calendar Source
                </label>
                <div className="relative">
                  <select
                    id="calendarSelect"
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="block w-full min-w-52 appearance-none border-0 border-b-2 border-teal-200 bg-transparent px-0 py-2 pr-8 text-sm font-medium text-slate-800 transition-all duration-200 hover:border-teal-400 focus:border-teal-600 focus:ring-0 focus:outline-none"
                  >
                    {calendars.map((cal) => (
                      <option
                        key={cal.id}
                        value={cal.id}
                        className="bg-white text-slate-800"
                      >
                        {emailToName(cal.summary)}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                    <ChevronDown className="h-4 w-4 text-teal-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="p-6 sm:p-8">
        {user ? (
          <>
            {/* Enhanced Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-teal-100 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:shadow-teal-500/10">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{todayEvents.length}</p>
                    <p className="text-sm text-slate-500">Today's Interviews</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/10">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                    <CalendarDays className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{thisWeekEvents}</p>
                    <p className="text-sm text-slate-500">This Week</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/10">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{Object.keys(eventsByDate).length}</p>
                    <p className="text-sm text-slate-500">Active Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Content Section */}
            <div className="rounded-3xl border border-teal-100/50 bg-white/40 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-slate-800">
                  Upcoming Interviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Next 7 days • {upcomingAppointments.length} interview{upcomingAppointments.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>

              {/* Grouped Events */}
              <div className="space-y-8">
                {Object.keys(eventsByDate).length === 0 ? (
                  <div className="mx-auto max-w-md py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100">
                      <CalendarDays className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-slate-800">
                      No interviews scheduled
                    </h3>
                    <p className="text-slate-500">
                      You have no interviews in the next 7 days. Enjoy your free time!
                    </p>
                  </div>
                ) : (
                  Object.keys(eventsByDate)
                    .sort((a, b) => new Date(a) - new Date(b))
                    .map((date) => (
                      <div key={date} className="space-y-4">
                        {/* Enhanced Date Section */}
                        <div className="flex items-center space-x-4">
                          <div className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-white shadow-md shadow-teal-500/25">
                            <h3 className="text-sm font-semibold">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </h3>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-slate-800">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {eventsByDate[date].length} interview{eventsByDate[date].length !== 1 ? 's' : ''} scheduled
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {eventsByDate[date].map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-md py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100">
              <CalendarDays className="h-10 w-10 text-teal-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800">
              Welcome to Interview Dashboard
            </h3>
            <p className="mb-8 text-slate-600">
              Connect your Google account to view and manage your interviews.
            </p>
            <button
              onClick={startAuth}
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-teal-500/25 transition-all duration-200 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
          </div>
        )}
      </main>

      {loading && <LoadingOverlay message="Loading your interviews..." />}
    </div>
  );
}
