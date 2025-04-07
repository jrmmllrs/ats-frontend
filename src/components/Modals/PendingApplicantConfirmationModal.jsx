import { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import api from "../../api/axios";

const PendingApplicantConfirmationModal = ({ isOpen, onClose, applicant, onActionComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling when modal opens
      document.body.style.overflow = 'hidden';
    }
    
    // Re-enable scrolling when modal closes
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const fullName = `${applicant.first_name} ${applicant.middle_name ? applicant.middle_name + " " : ""}${applicant.last_name}`;
  const message = `What would you like to do with ${fullName}'s application for ${applicant.position}?`;

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
    <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center">
        <div className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full">
          <h2 className="mb-4 text-lg font-semibold">Pending Applicant Actions</h2>
          <p className="mb-4">{message}</p>
          
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-4">
            <button
              className="rounded-md bg-teal-600/10 px-4 py-2 text-teal-600 hover:bg-teal-600/20 hover:text-teal-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-rose-600/10 px-4 py-2 text-rose-600 hover:bg-rose-600/20 hover:text-rose-700"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              <FiX className="inline mr-1" />
              Reject
            </button>
            <button
              className="rounded-md bg-[#008080] px-4 py-2 text-white hover:bg-teal-700"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              <FiCheck className="inline mr-1" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApplicantConfirmationModal;