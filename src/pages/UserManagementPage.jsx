import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiUsers, FiPlus, FiEdit2, FiX, FiAlertCircle, FiChevronLeft,
  FiChevronRight,

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
  const [prevJobTitleId, setPrevJobTitleId] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersRes = await api.get("/user/user-accounts");
      console.log('user', usersRes.data.userAccounts);
      setUsers(usersRes.data.userAccounts);

      // Fetch service features
      setFeaturesLoading(true);
      const featuresRes = await api.get("/user/service-features");
      setServiceFeatures(featuresRes.data.service_features);
      setFeaturesLoading(false);

      // Fetch job titles
      setTitlesLoading(true);
      const jobTitlesRes = await api.get("/user/job-titles");
      console.log('jobroute', jobTitlesRes.data);
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

  useEffect(() => {
    // Only run when job_title_id actually changes (not initial load)
    if (form.job_title_id && form.job_title_id !== prevJobTitleId && 
        jobTitles.length > 0 && serviceFeatures.length > 0) {
      
      const selectedJob = jobTitles.find(job => 
        job.job_title_id === form.job_title_id || 
        job.id === form.job_title_id
      );
      
      if (selectedJob) {
        const jobTitleName = (selectedJob.job_title || selectedJob.name).toLowerCase();
        
        // Only modify permissions for specific job titles
        if (jobTitleName.includes('hr') || jobTitleName.includes('interviewer')) {
          let newFeatureIds = [];
          
          if (jobTitleName.includes('hr')) {
            // HR gets all permissions
            newFeatureIds = serviceFeatures.map(f => f.service_feature_id);
          } else if (jobTitleName.includes('interviewer')) {
            // Interviewer gets only specific permissions
            newFeatureIds = serviceFeatures
              .filter(f => 
                f.feature_name.toLowerCase().includes('interview notes') ||
                f.feature_name.toLowerCase().includes('applicant listing')
              )
              .map(f => f.service_feature_id);
          }
          
          setForm(prev => ({
            ...prev,
            service_feature_ids: newFeatureIds
          }));
        }
      }
      
      // Update previous job title ID
      setPrevJobTitleId(form.job_title_id);
    }
  }, [form.job_title_id, jobTitles, serviceFeatures, prevJobTitleId]);


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
        console.log('editId', editId);
        await api.put(`user/user-management/${encodeURIComponent(editId)}`, payload);
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


  const columns = [
    {
      name: 'User',
      selector: row => row.user_email,
      sortable: true,
      cell: row => (
        <div className="flex items-center py-3">
          <div className="flex-shrink-0 h-10 w-10 bg-[#008080]/10 rounded-lg flex items-center justify-center">
            <span className="text-lg font-medium text-[#008080]">
              {row.first_name?.charAt(0) || row.last_name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {row.user_email}
            </div>
          </div>
        </div>
      ),
      minWidth: '250px'
    },
    {
      name: 'Contact',
      selector: row => row.contact_number,
      cell: row => (
        <div className="py-3">
          {row.personal_email && (
            <div className="text-xs text-gray-600 mb-1">
              {row.personal_email}
            </div>
          )}
          {row.contact_number && (
            <div className="text-xs text-gray-600">
              {row.contact_number}
            </div>
          )}
        </div>
      ),
      minWidth: '180px'
    },
    {
      name: 'Role',
      selector: row => row.job_title_id,
      sortable: true,
      cell: row => {
        const jobTitle = jobTitles.find(j =>
          j.job_title_id === row.job_title_id || j.id === row.job_title_id
        );
        
        return (
          <div className="py-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#008080]/10 text-[#008080]">
              {jobTitle?.job_title || jobTitle?.name || "N/A"}
            </span>
          </div>
        );
      },
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
          className="text-gray-500 hover:text-[#008080] transition-colors p-2 hover:bg-gray-50 rounded-lg"
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

  // Custom pagination component with modern styling
  const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
    const pages = Math.ceil(rowCount / rowsPerPage);
    const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * rowsPerPage, rowCount)}</span> of <span className="font-medium">{rowCount}</span> users
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 flex items-center hover:bg-gray-50 transition-colors"
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {range(1, pages).map(page => (
            <button
              key={page}
              onClick={() => onChangePage(page)}
              className={`px-3.5 py-1.5 rounded-lg text-sm min-w-[40px] transition-colors ${currentPage === page
                  ? 'bg-[#008080] text-white shadow-sm'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onChangePage(currentPage < pages ? currentPage + 1 : pages)}
            disabled={currentPage === pages}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 flex items-center hover:bg-gray-50 transition-colors"
          >
            Next
            <FiChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
            <DataTable
              columns={columns}
              data={filteredUsers}
              progressPending={loading}
              progressComponent={
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#008080] mb-3"></div>
                  <p className="text-sm text-gray-500">Loading users...</p>
                </div>
              }
              noDataComponent={
                <div className="py-10 text-center">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-3">
                    <FiUsers className="w-full h-full opacity-50" />
                  </div>
                  <p className="text-sm text-gray-500">No users found</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="mt-3 text-[#008080] hover:text-[#006666] text-sm font-medium"
                  >
                    Add your first user
                  </button>
                </div>
              }
              pagination
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponent={CustomPagination}
              highlightOnHover
              pointerOnHover
              responsive
              customStyles={{
                headCells: {
                  style: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    letterSpacing: '0.5px',
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                  },
                },
                rows: {
                  style: {
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid #f1f5f9',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                {editId ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="user_email"
                        value={form.user_email}
                        onChange={handleChange}
                        type="email"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password{!editId && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        name="user_password"
                        value={form.user_password}
                        onChange={handleChange}
                        type="password"
                        required={!editId}
                        minLength={8}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                      {!editId && (
                        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Middle Name
                      </label>
                      <input
                        name="middle_name"
                        value={form.middle_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Extension Name
                      </label>
                      <input
                        name="extension_name"
                        value={form.extension_name}
                        onChange={handleChange}
                        placeholder="Jr., Sr., III"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Birthdate
                      </label>
                      <input
                        name="birthdate"
                        type="date"
                        value={form.birthdate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Personal Email
                      </label>
                      <input
                        name="personal_email"
                        value={form.personal_email}
                        onChange={handleChange}
                        type="email"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <input
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        type="tel"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800">Job Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="job_title_id"
                        value={form.job_title_id}
                        onChange={handleChange}
                        required
                        disabled={titlesLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
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

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Company ID
                      </label>
                      <input
                        name="company_id"
                        value={form.company_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

             
                        <div className="space-y-4">
                          <h4 className="text-base font-medium text-gray-800">Access Permissions</h4>
                          {featuresLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#008080] mr-2"></div>
                            <span className="text-sm text-gray-500">Loading permissions...</span>
                          </div>
                          ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {serviceFeatures.map(feature => (
                            <div key={feature.service_feature_id} className="flex items-start">
                              <div className="flex items-center h-5 mt-0.5">
                              <input
                                type="checkbox"
                                id={`feature-${feature.service_feature_id}`}
                                checked={form.service_feature_ids.includes(feature.service_feature_id)}
                                onChange={() => handleFeatureToggle(feature.service_feature_id)}
                                className="h-4 w-4 text-[#008080] focus:ring-[#008080] border-gray-300 rounded"
                              />
                              </div>
                              <label htmlFor={`feature-${feature.service_feature_id}`} className="ml-2 text-sm text-gray-700">
                              <div className="font-medium">{feature.feature_name}</div>
                              {feature.description && (
                                <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                              )}
                              </label>
                            </div>
                            ))}
                          </div>
                          )}
                        </div>

                        {/* Form actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition-all text-sm font-medium shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                        {editId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
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