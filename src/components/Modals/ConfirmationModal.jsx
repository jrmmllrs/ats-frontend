import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

const ConfirmationModal = ({ 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel, 
  isSaving,
  icon = "warning" // can be 'warning', 'success', or 'danger'
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = '';
  }, []);

  const iconMap = {
    warning: <FiAlertCircle className="w-6 h-6 text-teal-500" />,
    success: <FiCheck className="w-6 h-6 text-teal-500" />,
    danger: <FiX className="w-6 h-6 text-teal-500" />
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="relative w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5">
            {/* Decorative gradient bar */}
            <div className="h-1 w-full bg-teal-500"></div>
            
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-full bg-teal-100">
                  {iconMap[icon]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-gray-600">{message}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isSaving}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-150 bg-teal-600 hover:bg-teal-700 ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : confirmText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;