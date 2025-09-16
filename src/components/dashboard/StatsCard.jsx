// src/components/dashboard/StatsCards.jsx
import { CalendarDays, Clock, Bell, Settings } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function StatsCards({ appointments }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:col-span-4">
      {/* Total Events */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center">
          <div className="rounded-lg bg-blue-50 p-2">
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
        </div>
      </div>

      {/* Today's Events */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center">
          <div className="rounded-lg bg-green-50 p-2">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Today's Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                appointments.filter((event) => {
                  const eventDate = event.start?.dateTime
                    ? formatDate(new Date(event.start.dateTime))
                    : formatDate(new Date(event.start.date));
                  return eventDate === formatDate(new Date());
                }).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center">
          <div className="rounded-lg bg-purple-50 p-2">
            <Bell className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                appointments.filter((event) => {
                  const eventDate = event.start?.dateTime
                    ? new Date(event.start.dateTime)
                    : new Date(event.start.date);
                  return eventDate > new Date();
                }).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* This Month */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center">
          <div className="rounded-lg bg-orange-50 p-2">
            <Settings className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                appointments.filter((event) => {
                  const eventDate = event.start?.dateTime
                    ? new Date(event.start.dateTime)
                    : new Date(event.start.date);
                  const now = new Date();
                  return (
                    eventDate.getMonth() === now.getMonth() &&
                    eventDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
