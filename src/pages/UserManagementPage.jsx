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
  const [form, setForm] = useState({
    user_email: "",
    user_password: "",
    user_key: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    extension_name: "",
    sex: "",
    user_pic: "",
    personal_email: "",
    contact_number: "",
    birthdate: "",
    company_id: "",
    job_title_id: "",
    department_id: "",
    division_id: "",
    upline_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-management/");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editId) {
        // Only update user basic info (as per backend)
        await api.put(`/user-management/${editId}`, {
          user_email: form.user_email,
          user_password: form.user_password,
          user_key: form.user_key,
          is_deactivated: form.is_deactivated || 0,
        });
      } else {
        await api.post("/user-management/create", form);
      }
      setForm({
        user_email: "",
        user_password: "",
        user_key: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        extension_name: "",
        sex: "",
        user_pic: "",
        personal_email: "",
        contact_number: "",
        birthdate: "",
        company_id: "",
        job_title_id: "",
        department_id: "",
        division_id: "",
        upline_id: "",
      });
      setEditId(null);
      setIsFormOpen(false);
      fetchUsers();
    } catch (err) {
      setError(editId ? "Failed to update user" : "Failed to add user");
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditId(user.user_id);
    setIsFormOpen(true);
    setForm({
      user_email: user.user_email || "",
      user_password: "", // Don't prefill password
      user_key: user.user_key || "",
      first_name: user.first_name || "",
      middle_name: user.middle_name || "",
      last_name: user.last_name || "",
      extension_name: user.extension_name || "",
      sex: user.sex || "",
      user_pic: user.user_pic || "",
      personal_email: user.personal_email || "",
      contact_number: user.contact_number || "",
      birthdate: user.birthdate ? user.birthdate.slice(0, 10) : "",
      company_id: user.company_id || "",
      job_title_id: user.job_title_id || "",
      department_id: user.department_id || "",
      division_id: user.division_id || "",
      upline_id: user.upline_id || "",
      is_deactivated: user.is_deactivated || 0,
    });
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditId(null);
    setIsFormOpen(false);
    setForm({
      user_email: "",
      user_password: "",
      user_key: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      extension_name: "",
      sex: "",
      user_pic: "",
      personal_email: "",
      contact_number: "",
      birthdate: "",
      company_id: "",
      job_title_id: "",
      department_id: "",
      division_id: "",
      upline_id: "",
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns for DataTable
  const columns = [
    {
      name: 'Email',
      selector: row => row.user_email,
      sortable: true,
      cell: row => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.user_email}</div>
          <div className="text-xs text-gray-500">{row.user_key}</div>
        </div>
      ),
      minWidth: '250px'
    },
    {
      name: 'Name',
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
      cell: row => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-teal-600">
              {row.first_name?.charAt(0) || row.last_name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-xs text-gray-500">{row.personal_email || "No personal email"}</div>
          </div>
        </div>
      ),
      minWidth: '250px'
    },
    {
      name: 'Contact',
      selector: row => row.contact_number,
      sortable: true,
      cell: row => (
        <div>
          <div className="text-sm text-gray-900">{row.contact_number || "N/A"}</div>
          <div className="text-xs text-gray-500">
            {row.birthdate ? row.birthdate.slice(0, 10) : "No birthdate"}
          </div>
        </div>
      ),
      minWidth: '150px'
    },
    {
      name: 'Status',
      selector: row => row.is_deactivated ? "Inactive" : "Active",
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
          row.is_deactivated 
            ? 'bg-red-50 text-red-600' 
            : 'bg-teal-50 text-teal-600'
        }`}>
          {row.is_deactivated ? "Inactive" : "Active"}
        </span>
      ),
      minWidth: '100px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1"
          >
            <FiEdit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '80px'
    },
  ];

  // Custom pagination component
  const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
    const pages = Math.ceil(rowCount / rowsPerPage);
    const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, rowCount)} of {rowCount} users
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 flex items-center"
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          {range(1, pages).map(page => (
            <button
              key={page}
              onClick={() => onChangePage(page)}
              className={`px-3 py-1 border rounded text-sm ${
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
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 flex items-center"
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
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
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
                    New User
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
                        User Email*
                      </label>
                      <input
                        name="user_email"
                        value={form.user_email}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editId ? "New Password (leave blank to keep)" : "Password*"}
                      </label>
                      <input
                        name="user_password"
                        value={form.user_password}
                        onChange={handleChange}
                        type="password"
                        required={!editId}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Key*
                      </label>
                      <input
                        name="user_key"
                        value={form.user_key}
                        onChange={handleChange}
                        placeholder="Unique identifier"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="John"
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
                        placeholder="Michael"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Doe"
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
                        Sex
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
                        placeholder="personal@example.com"
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
                        placeholder="+1234567890"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
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