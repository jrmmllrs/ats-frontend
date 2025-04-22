import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  FiUsers, FiPlus, FiEdit2, FiX, FiCheck, 
  FiSearch, FiAlertCircle, FiLoader, FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";
import DataTable from 'react-data-table-component';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [serviceFeatures, setServiceFeatures] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [form, setForm] = useState({
    user_email: "",
    user_password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    extension_name: "",
    sex: "",
    user_pic: "",
    personal_email: "",
    contact_number: "",
    birthdate: "",
    company_id: "717a6512-b8f6-4586-8431-feb3fcad585c",
    job_title_id: "",
    service_feature_ids: []
  });

  

  const [loading, setLoading] = useState(false);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersRes = await api.get("/user/user-accounts");
      console.log('user',usersRes.data.userAccounts);
      setUsers(usersRes.data.userAccounts);
      
      // Fetch service features
      setFeaturesLoading(true);
      const featuresRes = await api.get("/user/service-features");
      setServiceFeatures(featuresRes.data.service_features);
      setFeaturesLoading(false);
      
      // Fetch job titles
      setTitlesLoading(true);
      const jobTitlesRes = await api.get("/user/job-titles");
      console.log('jobroute',jobTitlesRes.data);
      setJobTitles(jobTitlesRes.data.job_titles);
      setTitlesLoading(false);
      
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

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle service feature selection
  const handleFeatureToggle = (featureId) => {
    setForm(prev => {
      const newFeatures = prev.service_feature_ids.includes(featureId)
        ? prev.service_feature_ids.filter(id => id !== featureId)
        : [...prev.service_feature_ids, featureId];
      return { ...prev, service_feature_ids: newFeatures };
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        ...form,
        service_feature_ids: JSON.stringify(form.service_feature_ids)
      };

      if (editId) {
        console.log('editId',editId);
        await api.put(`user/user-management/${editId}`, payload);
      } else {
        // Create new user
        await api.post("/user/create-user", payload);
      }
      
      // Reset form and refresh data
      handleCancel();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 
        (editId ? "Failed to update user" : "Failed to create user"));
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditId(null);
    setIsFormOpen(false);
    setForm({
      user_email: "",
      user_password: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      extension_name: "",
      sex: "",
      user_pic: "",
      personal_email: "",
      contact_number: "",
      birthdate: "",
      company_id: "717a6512-b8f6-4586-8431-feb3fcad585c",
      job_title_id: "",
      service_feature_ids: []
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()))
  ));


  // Columns for DataTable
  const columns = [
    {
      name: 'Email',
      selector: row => row.user_email,
      sortable: true,
      cell: row => (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-900">{row.user_email}</div>
          {row.personal_email && (
            <div className="text-xs text-gray-500">{row.personal_email}</div>
          )}
        </div>
      ),
      minWidth: '200px'
    },
    {
      name: 'Name',
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
      cell: row => (
        <div className="flex items-center py-2">
          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-teal-600">
              {row.first_name?.charAt(0) || row.last_name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {row.first_name} {row.middle_name} {row.last_name} {row.extension_name}
            </div>
            <div className="text-xs text-gray-500">
              {row.contact_number || "No contact number"}
            </div>
          </div>
        </div>
      ),
      minWidth: '250px'
    },
    {
      name: 'Job Title',
      selector: row => row.job_title_id,
      sortable: true,
      cell: row => (
        <div className="text-sm text-gray-900 py-2">
          {jobTitles.find(j => j.job_title_id === row.job_title_id)?.job_title_name || "N/A"}
        </div>
      ),
      minWidth: '150px'
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => {
            setEditId(row.user_id);
            setIsFormOpen(true);
            setForm({
              user_email: row.user_email,
              user_password: "",
              first_name: row.first_name,
              middle_name: row.middle_name,
              last_name: row.last_name,
              extension_name: row.extension_name,
              sex: row.sex,
              user_pic: row.user_pic,
              personal_email: row.personal_email,
              contact_number: row.contact_number,
              birthdate: row.birthdate ? row.birthdate.slice(0, 10) : "",
              company_id: row.company_id || "717a6512-b8f6-4586-8431-feb3fcad585c",
              job_title_id: row.job_title_id || "",
              service_feature_ids: row.service_features ? 
                row.service_features.map(f => f.service_feature_id) : 
                []
            });
          }}
          className="text-teal-600 hover:text-teal-800 transition-colors p-2"
          title="Edit user"
        >
          <FiEdit2 className="h-5 w-5" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '80px'
    },
  ];

  // Custom pagination component
  const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
    const pages = Math.ceil(rowCount / rowsPerPage);
    const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, rowCount)} of {rowCount} users
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 flex items-center hover:bg-gray-50"
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          {range(1, pages).map(page => (
            <button
              key={page}
              onClick={() => onChangePage(page)}
              className={`px-3 py-1 border rounded text-sm min-w-[40px] ${
                currentPage === page 
                  ? 'bg-teal-600 text-white border-teal-600' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onChangePage(currentPage < pages ? currentPage + 1 : pages)}
            disabled={currentPage === pages}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 flex items-center hover:bg-gray-50"
          >
            Next
            <FiChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <FiUsers className="h-6 w-6 text-teal-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* User table */}
          <div className="p-6">
            <DataTable
              columns={columns}
              data={filteredUsers}
              progressPending={loading}
              progressComponent={
                <div className="flex flex-col items-center justify-center py-10">
                  <FiLoader className="h-8 w-8 text-teal-500 animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Loading users...</p>
                </div>
              }
              noDataComponent={
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              }
              pagination
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponent={CustomPagination}
              highlightOnHover
              pointerOnHover
              responsive
              striped
              customStyles={{
                headCells: {
                  style: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {editId ? (
                  <>
                    <FiEdit2 className="h-5 w-5 text-teal-600" />
                    Edit User
                  </>
                ) : (
                  <>
                    <FiPlus className="h-5 w-5 text-teal-600" />
                    Add New User
                  </>
                )}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Information */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                      </label>
                      <input
                        name="user_email"
                        value={form.user_email}
                        onChange={handleChange}
                        type="email"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password{!editId && '*'}
                      </label>
                      <input
                        name="user_password"
                        value={form.user_password}
                        onChange={handleChange}
                        type="password"
                        required={!editId}
                        minLength={8}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      {!editId && (
                        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name
                      </label>
                      <input
                        name="middle_name"
                        value={form.middle_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extension Name
                      </label>
                      <input
                        name="extension_name"
                        value={form.extension_name}
                        onChange={handleChange}
                        placeholder="Jr., Sr., III"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birthdate
                      </label>
                      <input
                        name="birthdate"
                        type="date"
                        value={form.birthdate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Personal Email
                      </label>
                      <input
                        name="personal_email"
                        value={form.personal_email}
                        onChange={handleChange}
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Job Information */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Job Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title*
                      </label>
                      <select
                        name="job_title_id"
                        value={form.job_title_id}
                        onChange={handleChange}
                        required
                        disabled={titlesLoading}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Job Title</option>
                        {jobTitles.map(job => (
                          <option key={job.job_title_id} value={job.job_title_id}>
                            {job.job_title}
                          </option>
                        ))}
                      </select>
                      {titlesLoading && (
                        <p className="mt-1 text-xs text-gray-500">Loading job titles...</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company ID
                      </label>
                      <input
                        name="company_id"
                        value={form.company_id}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                {/* Permissions */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Access Permissions</h4>
                  {featuresLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <FiLoader className="h-5 w-5 text-teal-500 animate-spin mr-2" />
                      <span className="text-sm text-gray-500">Loading permissions...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {serviceFeatures.map(feature => (
                        <div key={feature.service_feature_id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`feature-${feature.service_feature_id}`}
                            checked={form.service_feature_ids.includes(feature.service_feature_id)}
                            onChange={() => handleFeatureToggle(feature.service_feature_id)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`feature-${feature.service_feature_id}`} className="ml-2 text-sm text-gray-700">
                            {feature.feature_name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Form actions */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <FiX className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        {editId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <FiCheck className="h-4 w-4" />
                        {editId ? "Update User" : "Create User"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPage;