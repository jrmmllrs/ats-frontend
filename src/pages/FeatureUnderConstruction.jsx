import React from 'react'
import { useNavigate } from 'react-router-dom'
import UnderConstructionIcon from '../assets/FeatureUnderContruction.svg';
import { FaArrowLeft } from "react-icons/fa";

function FeatureUnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-24 px-6 py-12 min-h-screen bg-gray-50 text-center">
    
      
      <img
        src={UnderConstructionIcon}
        alt="Under Construction"
        className="w-96 h-96 mb-8"
      />

      <p className="text-lg text-gray-600 mb-6">
        We're working hard to bring you this feature. Stay tuned!
      </p>  

   <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
            >
                <FaArrowLeft />
                Go Back
            </button>
    </div>
  )
}

export default FeatureUnderConstruction
