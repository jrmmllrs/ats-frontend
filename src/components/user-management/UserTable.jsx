import React from "react";
import DataTable from 'react-data-table-component';
import { FiEdit2, FiUsers } from "react-icons/fi";
import CustomPagination from "./CustomPagination";

const UserTable = ({ users, jobTitles, loading, searchTerm, onEdit }) => {
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
          onClick={() => onEdit(row)}
          className="text-gray-500 hover:text-[#008080] transition-colors p-2 hover:bg-gray-50 rounded-lg"
          title="Edit user"
        >
          <FiEdit2 className="h-5 w-5" />
        </button>
      ),
      ignoreRowClick: true,
      // Remove allowOverflow and button props
      width: '120px'
    },
  ];

  return (
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
        </div>
      }
      pagination
      paginationPerPage={10}
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
  );
};

export default UserTable;