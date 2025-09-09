import React from 'react'

import UnderConstructionIcon from '../assets/FeatureUnderContruction.svg';


function FeatureUnderConstruction() {
 
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

   
    </div>
  )
}

export default FeatureUnderConstruction
