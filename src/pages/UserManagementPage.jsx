import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FiUsers, FiPlus } from "react-icons/fi";
import UserTable from "../components/user-management/UserTable";
import UserForm from "../components/user-management/UserForm";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [serviceFeatures, setServiceFeatures] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersRes = await api.get("/user/user-accounts");
      setUsers(usersRes.data.userAccounts);

      // Fetch service features
      const featuresRes = await api.get("/user/service-features");
      setServiceFeatures(featuresRes.data.service_features);

      // Fetch job titles
      const jobTitlesRes = await api.get("/user/job-titles");
      setJobTitles(jobTitlesRes.data.job_titles);

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-light">
          {/* Header */}
          <div className="px-6 py-5 bg-[#008080]/5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <FiUsers className="h-6 w-6 text-[#008080]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage all system users and their permissions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                />
              </div>

              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#008080] hover:bg-[#006666] text-white font-medium py-2 px-4 rounded-lg transition-all duration-150 ease-in-out shadow-sm hover:shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Error</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* User table */}
          <div className="p-6">
            <UserTable
              users={users}
              jobTitles={jobTitles}
              loading={loading}
              searchTerm={searchTerm}
              onEdit={(user) => {
                setEditId(user.user_id);
                setIsFormOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {isFormOpen && (
        <UserForm
          editId={editId}
          jobTitles={jobTitles}
          serviceFeatures={serviceFeatures}
          onClose={() => {
            setEditId(null);
            setIsFormOpen(false);
          }}
          onSuccess={() => {
            fetchData();
            setEditId(null);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default UserManagementPage;