import React, { useState, useEffect, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import api from "../../services/api";

const CandidateDropOffRate = ({ year, month, selectedPosition }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropOffRate, setDropOffRate] = useState("0.00%");
  const [lastFetch, setLastFetch] = useState(0);

  // Fetch drop-off rate data
  const fetchDropOffRate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construct the endpoint URL with query parameters
      let url = `/analytic/metrics/candidate-drop-off-rate?year=${year}&month=${month}`;
      if (selectedPosition && selectedPosition !== "") {
        url += `&position_id=${selectedPosition}`;
      }

      const response = await api.get(url);
      const data = response.data;

      // Update state with the drop-off rate
      setDropOffRate(data.drop_off_rate || "0.00%");
      setLastFetch(new Date().getTime());
    } catch (err) {
      console.error("Error fetching candidate drop-off rate:", err);
      setError("Failed to load drop-off rate data");
    } finally {
      setIsLoading(false);
    }
  }, [year, month, selectedPosition]);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchDropOffRate();
  }, [fetchDropOffRate]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Candidate Drop-Off Rate</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span className="absolute mt-5 w-48 p-2 body-tiny text-teal bg-teal-soft rounded shadow-lg text-justify z-10">
              This shows the percentage of candidates who start but do not complete the application or interview process.
              <br />
              Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : "Never"}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="mb-6 text-center text-4xl font-semibold">
          {dropOffRate}
        </div>
      )}
    </>
  );
};

export default CandidateDropOffRate;