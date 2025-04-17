import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaEnvelope, FaPen, FaPhone, FaUser, FaHistory } from 'react-icons/fa';
import useUserStore from '../../context/userStore';
import api from '../../api/axios';
import Toast from '../../assets/Toast';
import { FaCakeCandles, FaFileLines } from 'react-icons/fa6';
import AddApplicantForm from '../../pages/AddApplicantForm';
import { statusMapping } from '../../hooks/statusMapping';
import { useApplicantData } from '../../hooks/useApplicantData';


function ApplicantDetails({ applicant, onTabChange, activeTab, onApplicantUpdate }) {
  const { statuses } = useApplicantData();
  const [status, setStatus] = useState('');
  const [toasts, setToasts] = useState([]);
  const { user } = useUserStore();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateApplicable, setIsDateApplicable] = useState(true);
  const [pendingStatus, setPendingStatus] = useState('');
  const [showStatusHistoryModal, setShowStatusHistoryModal] = useState(false);

  // Skip status warning modal
  const [showSkipWarningModal, setShowSkipWarningModal] = useState(false);
  const [skippedStatuses, setSkippedStatuses] = useState([]);

  //blacklisted info
  const [blacklistedType, setBlacklistedType] = useState(null);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (applicant && applicant.status) {
      setStatus(statusMapping[applicant.status] || '');

      // Fetch status history when applicant changes
      if (applicant.progress_id) {
        fetchStatusHistory(applicant.progress_id);
      }
    } else {
      setStatus('');
    }
  }, [applicant]);

  const fetchStatusHistory = async (progressId) => {
    try {
      const response = await api.get(`/applicant/status-history/${progressId}`);
      setStatusHistory(response.data);
    } catch (error) {
      console.error("Error fetching status history:", error);
    }
  };



  // Function to check if statuses are being skipped
  const checkForSkippedStatuses = (currentStatus, newStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    const newIndex = statuses.indexOf(newStatus);

    // Only check forward progression (not backward)
    if (newIndex > currentIndex + 1) {
      // Get the skipped statuses
      const skipped = statuses.slice(currentIndex + 1, newIndex);
      return skipped;
    }
    return [];
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);

    // Check if any statuses are being skipped
    if (applicant && applicant.status) {
      const skipped = checkForSkippedStatuses(applicant.status, newStatus);

      if (skipped.length > 0) {
        setSkippedStatuses(skipped);
        setShowSkipWarningModal(true);
        return;
      }
    }

    // If no statuses are skipped, proceed normally
    setShowDatePicker(true);

    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setIsDateApplicable(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateApplicableChange = (e) => {
    setIsDateApplicable(e.target.checked);
  };

  const proceedWithStatusChange = () => {
    // Close the warning modal
    setShowSkipWarningModal(false);

    // Proceed with the date picker
    setShowDatePicker(true);

    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setIsDateApplicable(true);
  };

  const cancelSkipStatusChange = () => {
    // Reset pending status and close warning modal
    setPendingStatus('');
    setShowSkipWarningModal(false);
  };

  const confirmStatusChange = async () => {
    const newStatus = pendingStatus;
    const previousStatus = status; // Store previous status
    const previousBackendStatus = applicant.status; // Store previous backend status

    setStatus(newStatus);
    setShowDatePicker(false);

    // Update the applicant status in the backend
    if (applicant && applicant.applicant_id) {
      const backendStatus = newStatus;
      let data = {
        "progress_id": applicant.progress_id,
        "applicant_id": applicant.applicant_id,
        "status": backendStatus,
        "user_id": user.user_id,
        "change_date": isDateApplicable ? selectedDate : "N/A",
        "previous_status": previousBackendStatus,
        "blacklisted_type": blacklistedType,
        "reason": reason
      };

      try {
        await api.put(`/applicant/update/status`, data);

        // Create a copy of the applicant with updated status
        const updatedApplicant = { ...applicant, status: backendStatus };

        // Notify parent component of the update
        if (onApplicantUpdate) {
          onApplicantUpdate(updatedApplicant);
        }

        // Refresh status history to show the new change
        fetchStatusHistory(applicant.progress_id);

        console.log("Status updated successfully");

        // Add toast message with previous status information
        setToasts([...toasts, {
          id: Date.now(),
          applicant: applicant,
          status: newStatus,
          previousStatus: previousStatus,
          previousBackendStatus: previousBackendStatus
        }]);
      } catch (error) {
        console.error("Error updating status:", error);
        // Revert status on error
        setStatus(statusMapping[applicant.status]);
      }
    }
  };

  const cancelStatusChange = () => {
    setShowDatePicker(false);
    setPendingStatus('');
  };

  const undoStatusUpdate = async (toast) => {
    // Use the previous status stored in the toast object
    const backendStatus = toast.previousBackendStatus;

    let data = {
      "progress_id": applicant.progress_id,
      "status": backendStatus,
      "user_id": user.user_id,
    };

    try {
      await api.put(`/applicant/update/status`, data);

      // Create a copy of the applicant with reverted status
      const updatedApplicant = { ...applicant, status: backendStatus };

      // Notify parent component of the update
      if (onApplicantUpdate) {
        onApplicantUpdate(updatedApplicant);
      }

      // Refresh status history to show the reversal
      fetchStatusHistory(applicant.progress_id);

      setStatus(toast.previousStatus);
      setToasts(toasts.filter(t => t.id !== toast.id));
      console.log("Status reverted successfully");
    } catch (error) {
      console.error("Error reverting status:", error);
    }
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleEditSuccess = (updatedApplicant) => {
    if (onApplicantUpdate) {
      onApplicantUpdate(updatedApplicant);
    }
    setIsEditFormOpen(false);
  }

  // Format status for display
  const formatStatusForDisplay = (statusKey) => {
    return statusKey.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleStatusHistoryModal = () => {
    setShowStatusHistoryModal(!showStatusHistoryModal);
  };

  return (
    <div className="border border-gray-light bg-white rounded-xl mx-auto flex flex-col lg:flex-row overflow-hidden body-regular">

      {/* Left side */}
      <div className='p-5 pl-8 w-full lg:w-[350px] text-gray-dark h-full'>
        <h2 className="display">
          {`${applicant.first_name || ''} ${applicant.middle_name || ''} ${applicant.last_name || ''}`}
        </h2>
        <div className="pl-5 pt-2 flex flex-col flex-grow">
          {applicant.gender && (
            <div className="mt-2 flex items-center flex-shrink-0">
              <FaUser className="mr-2 h-4 w-4" />
              {applicant.gender}
            </div>
          )}
          {applicant.birth_date && (
            <div className="mt-1 flex items-center">
              <FaCakeCandles className="mr-2 h-4 w-4" />
              {new Date(applicant.birth_date).toLocaleDateString()}
            </div>
          )}
          {applicant.email_1 ? <div className="mt-1 flex items-center">
            <FaEnvelope className="mr-2 h-4 w-4 flex-shrink-0" />
            {applicant.email_1}
          </div> : null}
          {applicant.email_2 ? <div className="mt-1 flex items-center">
            <FaEnvelope className="mr-2 h-4 w-4 flex-shrink-0" />
            {applicant.email_2}
          </div> : null}
          {applicant.email_3 ? <div className="mt-1 flex items-center">
            <FaEnvelope className="mr-2 h-4 w-4 flex-shrink-0" />
            {applicant.email_3}
          </div> : null}
          {applicant.mobile_number_1 ? <div className="mt-1 flex items-center">
            <FaPhone className="mr-2 h-4 w-4 flex-shrink-0" />
            {applicant.mobile_number_1}
          </div> : null}
          {applicant.mobile_number_2 ? <div className="mt-1 flex items-center">
            <FaPhone className="mr-2 h-4 w-4 flex-shrink-0" />
            {applicant.mobile_number_2}
          </div> : null}
          <div className="mt-1 flex items-center">
            <FaFileLines className="mr-2 h-4 w-4" />
            <a
              href={applicant.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline block mt-1 cursor-pointer"
            >
              Test Result
            </a>
          </div>
          <div className="mt-1 flex items-censter">
            <FaAddressCard className="mr-2 h-4 w-4" />
            <a
              href={applicant.cv_link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline block mt-1 cursor-pointer"
            >
              Applicant's Resume
            </a>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="py-5 px-7 flex-1 flex flex-col lg:border-l border-gray-light">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="headline">Applicant Details</h2>
            <div className="flex items-center">
              <select
                className="border body-regular border-gray-light h-8 rounded-md cursor-pointer"
                value={applicant.status}
                onChange={handleStatusChange}
                disabled={toasts.length > 0 || showDatePicker} // Disable when there are active toasts or date picker is open
              >
                <option value="" disabled>Select status</option>
                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
              {statusHistory.length > 0 && (
                <button
                  onClick={toggleStatusHistoryModal}
                  className="ml-2 p-2.5 rounded-full bg-teal-soft hover:bg-teal/20 cursor-pointer"
                  title="View Status History"
                >
                  <FaHistory className="w-4 h-4 text-teal" />
                </button>
              )}
              <button
                onClick={handleEditClick}
                className="ml-2 p-2.5 rounded-full bg-teal hover:bg-teal/70 cursor-pointer"
              >
                <FaPen className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Status Skip Warning Modal */}
          {showSkipWarningModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
                <div className="flex items-center justify-center mb-4 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center mb-2">Warning: Skipping Status Steps</h3>
                <p className="mb-4 text-gray-600">
                  You are about to skip the following status steps:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  {skippedStatuses.map((status, index) => (
                    <li key={index}>{formatStatusForDisplay(status)}</li>
                  ))}
                </ul>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to proceed with this status change?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelSkipStatusChange}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedWithStatusChange}
                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Proceed Anyway
                  </button>
                </div>
              </div>
            </div>
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
                  {pendingStatus === "TEST_SENT" && (
                    <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-medium text-blue-800 flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                        Changing the status to 'Test Sent' will automatically send test assessment to applicant.
                      </p>
                    </div>
                  )}

                  {pendingStatus === "BLACKLISTED" && (
                    <div className="space-y-4 pt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blacklisted Type
                        </label>
                        <select
                          value={blacklistedType}
                          onChange={(e) => setBlacklistedType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select type</option>
                          <option value="SOFT">Soft</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Blacklist
                        </label>
                        <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select reason</option>
                          <option value="DID_NOT_TAKE_TEST">Did not take test</option>
                          <option value="NO_SHOW">No show</option>
                          <option value="CULTURE_MISMATCH">Culture mismatch</option>
                          <option value="EXPECTED_SALARY_MISMATCH">Expected salary mismatch</option>
                          <option value="WORKING_SCHEDULE_MISMATCH">Working schedule mismatch</option>
                          <option value="OTHER_REASONS">Other reasons</option>
                        </select>
                      </div>
                    </div>
                  )}



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

          {/* Status History Modal */}
          {showStatusHistoryModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[90vw] max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-teal">Status History</h3>
                  <button
                    onClick={toggleStatusHistoryModal}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Changed From</th>
                        <th className="px-4 py-2 text-left">Changed To</th>
                        <th className="px-4 py-2 text-left">Changed By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusHistory.map((record, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">
                            {record.change_date === "N/A"
                              ? 'N/A'
                              : record.changed_at
                                ? formatDate(record.changed_at)
                                : 'N/A'}
                          </td>
                          <td className="px-4 py-2">{record.previous_status ? formatStatusForDisplay(record.previous_status) : 'Initial Status'}</td>
                          <td className="px-4 py-2">{formatStatusForDisplay(record.new_status)}</td>
                          <td className="px-4 py-2">{record.user_name || record.changed_by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pl-5 flex-grow">
            <div className="text-teal">Applied for</div>
            <div className="col-span-2">{applicant.job_title || 'Not specified'}</div>
            <div className="text-teal">Applied on</div>
            <div className="col-span-2">
              {applicant.applicant_created_at
                ? new Date(applicant.applicant_created_at).toLocaleDateString()
                : 'Not specified'}
            </div>
            <div className="text-teal">Applied from</div>
            <div className="col-span-2">{applicant.applied_source || 'Not specified'}</div>
          </div>

          {/* Tabs */}
          <div className="mt-auto pt-5 flex justify-end">
            <div className="flex gap-2 bg-teal-soft p-1 rounded-md">
              {/* Service ID */}
              {user.feature_names && user.feature_names["999b8e93-ca9a-4aa0-9242-5cf1e289a205"] === "Interview Notes" && (
                <button
                  className={`px-4 py-1 rounded-md ${activeTab === 'discussion'
                    ? 'bg-[#008080] text-white'
                    : 'text-teal hover:bg-teal-600/20 hover:text-teal-700 cursor-pointer'
                    }`}
                  onClick={() => onTabChange('discussion')}
                >
                  Discussion
                </button>
              )}
              {user.feature_names && user.feature_names["d878490d-e446-454c-83fa-7828d7782bf8"] === "Send Mail" && (
                <button
                  className={`px-4 py-1 rounded-md ${activeTab === 'sendMail'
                    ? 'bg-[#008080] text-white'
                    : 'text-teal hover:bg-teal-600/20 hover:text-teal-700 cursor-pointer'
                    }`}
                  onClick={() => onTabChange('sendMail')}
                >
                  Send Email
                </button>
              )}
            </div>
          </div>
        </div>

        {toasts.length > 0 && (
          <Toast toasts={toasts} onUndo={undoStatusUpdate} onDismiss={removeToast} />
        )}

      </div>

      {/* Toast Messages */}
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
      {isEditFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white w-full h-full overflow-auto lg:ml-72 pointer-events-auto">
            <AddApplicantForm
              onClose={handleCloseEditForm}
              initialData={applicant}
              onEditSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantDetails;