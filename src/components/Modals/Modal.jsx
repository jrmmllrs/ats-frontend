import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";

export default function Modal({ onClose, children }) {
  // 🔒 Disable background scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md bg-white p-6 shadow-lg z-10">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
