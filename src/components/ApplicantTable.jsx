import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Toast from '../assets/Toast';
import { useApplicantData } from '../hooks/useApplicantData';
import positionStore from '../context/positionStore';
import { initialStages } from '../utils/StagesData';
import { useStages } from '../hooks/useStages';
import applicantFilterStore from '../context/applicantFilterStore';
import useUserStore from '../context/userStore';
import { useToastManager } from '../utils/toastManager';
import { updateStatus } from '../utils/applicantDataUtils';
import { statusMapping } from '../hooks/statusMapping';
import api from '../api/axios';

const ApplicantTable = ({ onSelectApplicant }) => {
  const { applicantData, setApplicantData, statuses } = useApplicantData();
  const { positionFilter, setPositionFilter } = positionStore();
  const { setStages } = useStages();
  const { status, setSearch, search } = applicantFilterStore();
  const { user } = useUserStore();
  const { toasts, addToast, removeToast, undoStatusUpdate } = useToastManager();
  
  // New state variables for the date picker modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateApplicable, setIsDateApplicable] = useState(true);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const handleStatusChange = (id, progress_id, newStatus, currentStatus) => {
    // Store the pending status change
    setPendingStatusChange({
      id,
      progress_id,
      newStatus,
      currentStatus
    });
    
    // Show date picker
    setShowDatePicker(true);
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setIsDateApplicable(true);
  };

  const confirmStatusChange = async () => {

    if (!pendingStatusChange) return;
    
    const { id, progress_id, newStatus, currentStatus } = pendingStatusChange;

    console.log(id);
    
    
    // Close date picker
    setShowDatePicker(false);
    
    // Find applicant for toast notification
    const applicant = applicantData.find(applicant => applicant.applicant_id === id);
    
    // Update status in backend with date information
    try {
      const data = {
        "progress_id": progress_id,
        "applicant_id": id, 
        "status": newStatus,
        "user_id": user.user_id,
        "change_date": isDateApplicable ? selectedDate : "N/A", 
        "previous_status": currentStatus, 
      };
      
      await api.put(`/applicant/update/status`, data);

      console.log(data);
      
      // Update local state and show toast notification
      addToast(applicant, statusMapping[newStatus] || newStatus, statusMapping);
      
      // Update the applicant data in the state
      updateStatus(id, progress_id, newStatus, currentStatus, applicantData, setApplicantData, 
        positionFilter, setStages, initialStages, setPositionFilter, user);
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
    
    // Clear pending status change
    setPendingStatusChange(null);
  };

  const cancelStatusChange = () => {
    setShowDatePicker(false);
    setPendingStatusChange(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateApplicableChange = (e) => {
    setIsDateApplicable(e.target.checked);
  };

  const handleApplicantRowClick = (row) => {
    const applicant = applicantData.find((applicant) => applicant.applicant_id === row.applicant_id);
    if (applicant) {
      onSelectApplicant(applicant);
    }
    setPositionFilter("All");
    setSearch("");
  };

  const columns = [
    {
      name: 'Date Applied',
      selector: row => moment(row.created_at).format('MMMM DD, YYYY'),
    },
    {
      name: 'Applicant Name',
      selector: row => `${row.first_name} ${row.last_name}`,
    },
    {
      name: 'Position Applied',
      selector: row => row.title,
    },
    {
      name: 'Status',
      cell: row => (
        <select
          className='border border-gray-light max-w-[100px]'
          value={row.status}
          onChange={(e) => handleStatusChange(row.applicant_id, row.progress_id, e.target.value, status)}
          style={{ padding: '5px', borderRadius: '5px' }}
          disabled={showDatePicker} // Disable when date picker is open
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <>
      {applicantData.length === 0 && (search != "" || status.length != 0 || positionFilter != "") ? (
        <div className="text-center text-lg font-semibold text-gray-600 mt-8">
          No applicants found.
        </div>
      ) : (
        <DataTable
          pointerOnHover
          highlightOnHover
          striped
          fixedHeaderScrollHeight="60vh"
          responsive
          columns={columns}
          data={applicantData}
          // defaultSortAsc={false}
          // defaultSortFieldId={1}
          onRowClicked={handleApplicantRowClick}
          pagination
          progressPending={applicantData.length === 0 || !statuses.length}
          progressComponent={<LoadingComponent />}
        />
      )}
      
      {/* Date picker modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Change Status Date</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                When did this status change occur?
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={selectedDate}
                onChange={handleDateChange}
                disabled={!isDateApplicable}
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isDateApplicable}
                  onChange={handleDateApplicableChange}
                />
                <span className="text-sm text-gray-700">Date is applicable</span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelStatusChange}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-teal text-white rounded hover:bg-teal/80"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            undoStatusUpdate={undoStatusUpdate}
            removeToast={removeToast}
          />
        ))}
      </div>
    </>
  );
};

function LoadingComponent() {
  return (
    <div className="flex flex-col w-full space-y-2">
      <div className=" h-10 animate-pulse rounded-sm bg-gray-light"></div>
      <div className=" h-10 animate-pulse rounded-sm bg-gray-light"></div>
      <div className=" h-10 animate-pulse rounded-sm bg-gray-light"></div>
      <div className=" h-10 animate-pulse rounded-sm bg-gray-light"></div>
      <div className=" h-10 animate-pulse rounded-sm bg-gray-light"></div>
    </div>
  );
};

export default ApplicantTable;