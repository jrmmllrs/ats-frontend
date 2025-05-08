import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { FaInfoCircle } from "react-icons/fa";

const ApplicationReceived = ({ year, month, isExpanded, selectedPosition }) => {
  const [totalApplications, setTotalApplications] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  
  console.log('pos',selectedPosition)
  // Fetch application data
  const fetchApplicationData = useCallback(async () => {
    try {
      // Construct the endpoint URL with query parameters
      let url = `/analytic/metrics/applicant-received?year=${year}&month=${month}`;
      if (selectedPosition && selectedPosition !== "") {
        url += `&position_id=${selectedPosition}`;
      }

      const response = await api.get(url);
      const data = response.data;

      // Update state with the total count
      setTotalApplications(data.application_received);
      setLastFetch(new Date().getTime());
    } catch (error) {
      console.error("Error fetching application metrics:", error);
    }
  }, [year, month, selectedPosition]);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchApplicationData();
  }, [fetchApplicationData]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Applications Received</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span className="absolute mt-5 w-48 p-2 body-tiny text-teal bg-teal-soft rounded shadow-lg text-justify">
              This card shows the total number of applications received.
              <br />
              Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : "Never"}
            </span>
          )}
        </div>
      </div>

      <p className="mb-6 text-center text-4xl font-semibold">
        {totalApplications}
      </p>
    </>
  );
};

export default ApplicationReceived;