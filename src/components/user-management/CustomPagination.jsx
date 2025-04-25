import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
  const pages = Math.ceil(rowCount / rowsPerPage);
  const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * rowsPerPage, rowCount)}</span> of <span className="font-medium">{rowCount}</span> users
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 flex items-center hover:bg-gray-50 transition-colors"
        >
          <FiChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {range(1, pages).map(page => (
          <button
            key={page}
            onClick={() => onChangePage(page)}
            className={`px-3.5 py-1.5 rounded-lg text-sm min-w-[40px] transition-colors ${currentPage === page
                ? 'bg-[#008080] text-white shadow-sm'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onChangePage(currentPage < pages ? currentPage + 1 : pages)}
          disabled={currentPage === pages}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 flex items-center hover:bg-gray-50 transition-colors"
        >
          Next
          <FiChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;