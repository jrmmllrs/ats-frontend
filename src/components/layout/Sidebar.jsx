import { CalendarDays, Clock, Bell, Settings, LogOut } from "lucide-react";

export default function Sidebar({ user, onLogout }) {
  return (
    <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">Track and analyze your schedule</p>
      </div>
      <div className="flex-1 p-4">
        {user && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                {user.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">
            <CalendarDays size={16} /> <span>Calendar</span>
          </a>
          <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Clock size={16} /> <span>Schedule</span>
          </a>
          <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Bell size={16} /> <span>Notifications</span>
          </a>
          <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Settings size={16} /> <span>Settings</span>
          </a>
        </nav>
      </div>
      {user && (
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
