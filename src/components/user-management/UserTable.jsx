import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FiEdit2, FiUsers, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import api from "../../api/axios";
import ConfirmationModal from "../Modals/ConfirmationModal";

const UserTable = ({ users, loading, searchTerm, onEdit, onRefresh }) => {
  const [operationLoading, setOperationLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  const filteredUsers = users.filter(user =>
    user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.personal_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = async (user) => {
    try {
      setOperationLoading(true);
      const endpoint = user.is_deactivated === 1 
  
        ? `/user/activate/${encodeURIComponent(user.user_id)}`
        : `/user/deactivate/${encodeURIComponent(user.user_id)}`;
      await api.put(endpoint);
      onRefresh();
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert(`Failed to ${user.is_deactivated === 1 ? 'activate' : 'deactivate'} user. Please try again.`);
    } finally {
      setOperationLoading(false);
      setModalData(null);
    }
  };

  const columns = [
    {
      name: "User",
      selector: row => row.user_email,
      sortable: true,
      cell: row => (
        <div className="flex items-center py-3">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-lg font-medium text-gray-700">
              {row.first_name?.charAt(0) || row.last_name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-800">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-xs text-gray-500 mt-1">{row.user_email}</div>
          </div>
        </div>
      ),
      minWidth: "250px",
    },
    {
      name: "Contact",
      selector: row => row.contact_number,
      cell: row => (
        <div className="py-3">
          {row.personal_email && (
            <div className="text-xs text-gray-600 mb-1">{row.personal_email}</div>
          )}
          {row.contact_number && (
            <div className="text-xs text-gray-600">{row.contact_number}</div>
          )}
        </div>
      ),
      minWidth: "180px",
    },
    {
      name: "Status",
      cell: row => (
        <div className="flex items-center">
          <button
            onClick={() => 
              setModalData({
                title: row.is_deactivated === 1 ? "Activate User" : "Deactivate User",
                message: `Are you sure you want to ${row.is_deactivated === 1 ? 'activate' : 'deactivate'} ${row.user_email}?`,
                confirmAction: () => handleToggleUserStatus(row),
              })
            }
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
              row.is_deactivated === 1
                ? "text-red-700 hover:text-red-700 hover:bg-gray-100"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            title={row.is_deactivated === 1 ? "Activate user" : "Deactivate user"}
            disabled={operationLoading}
          >
            {row.is_deactivated === 1 ? (
              <FiToggleLeft className="h-5 w-5" />
            ) : (
              <FiToggleRight className="h-5 w-5" />
            )}
            <span>{row.is_deactivated === 1 ? "Inactive" : "Active"}</span>
          </button>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            title="Edit user"
            disabled={operationLoading}
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "100px",
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredUsers}
        progressPending={loading || operationLoading}
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
        highlightOnHover
        pointerOnHover
        responsive
        customStyles={{
          rows: {
            style: {
              fontSize: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
            },
          },
          pagination: {
            style: {
              display: 'flex',
              justifyContent: 'right',
              padding: '10px',
              fontSize: '12px',
              color: '#64748b',
            },
          },
        }}
      />
      {modalData && (
        <ConfirmationModal
          title={modalData.title}
          message={modalData.message}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={modalData.confirmAction}
          onCancel={() => setModalData(null)}
          isSaving={operationLoading}
        />
      )}
    </>
  );
};

export default UserTable;