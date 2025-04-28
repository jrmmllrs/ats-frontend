import React from "react";
import { FiCheck, FiInfo } from "react-icons/fi";

const PermissionCheckbox = ({ feature, checked, autoAssigned, onChange }) => {
  return (
    <div
      className={`
        group relative flex items-start p-4 rounded-2xl border transition-all
        ${autoAssigned ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}
        hover:shadow-md hover:border-gray-300
      `}
    >
      <div className="flex accent-[#008080] items-start w-full">
        <input
          type="checkbox"
          id={`feature-${feature.service_feature_id}`}
          checked={checked}
          onChange={onChange}
          className={`
            mt-1 h-4 w-4 rounded border transition
            ${autoAssigned ? 
              'text-gray-700 border-gray-400 focus:ring-gray-300' : 
              'text-gray-700 border-gray-300 focus:ring-gray-200'
            }
            focus:ring-2 focus:ring-offset-0
          `}
        />

        <div className="ml-3 flex-1 text-sm">
          <label
            htmlFor={`feature-${feature.service_feature_id}`}
            className="font-medium text-gray-900 cursor-pointer flex items-center"
          >
            {feature.feature_name}
            {autoAssigned && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-[#008080] rounded-full flex items-center">
                <FiCheck className="mr-1" size={12} /> Recommended
              </span>
            )}
          </label>
        </div>

   
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
   

          {/* Tooltip aligned to right */}
          <div className="absolute right-0 top-6 z-50 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-700 w-64 max-w-xs break-words animate-fade-in">
            <div className="font-semibold text-gray-900 mb-1">About this feature</div>
            {feature.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheckbox;