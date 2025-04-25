import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const JobTitleChangeConfirm = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FiAlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Change Job Title</h3>
              <p className="text-sm text-gray-600 mb-4">
                Changing this job title will modify the recommended permissions for this user.
                Do you want to update the permissions to match the new job title's recommendations?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Keep Current Permissions
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition-colors text-sm font-medium"
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTitleChangeConfirm;