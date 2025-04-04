import { useState } from "react";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import api from "../../api/axios";

const PendingApplicantConfirmationModal = ({ isOpen, onClose, applicant, onActionComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const fullName = `${applicant.first_name} ${applicant.middle_name ? applicant.middle_name + " " : ""}${applicant.last_name}`;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(`/applicants/pending/confirm`, {
        pending_applicant_id: applicant.applicant_id
      });
      onActionComplete("confirmed");
      onClose();
    } catch (err) {
      console.error("Error confirming applicant:", err);
      setError("Failed to confirm applicant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(`/applicants/pending/reject`, {
        pending_applicant_id: applicant.applicant_id
      });
      onActionComplete("rejected");
      onClose();
    } catch (err) {
      console.error("Error rejecting applicant:", err);
      setError("Failed to reject applicant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#e6ffff] sm:mx-0 sm:h-10 sm:w-10">
                <FiAlertCircle className="h-6 w-6 text-[#008080]" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Applicant Actions</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    What would you like to do with {fullName}'s application for {applicant.position}?
                  </p>
                  {error && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#008080] text-base font-medium text-white hover:bg-[#006060] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a0a0] sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              <FiCheck className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
              Confirm
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008080] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              <FiX className="mr-2" />
              Reject
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApplicantConfirmationModal;