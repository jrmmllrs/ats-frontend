import React, { useState, useEffect, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import api from "../../services/api";

const InternalVsExternalHires = ({ year, month }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalData, setInternalData] = useState({ count: 0, percentage: 0 });
  const [externalData, setExternalData] = useState({ count: 0, percentage: 0 });
  const [lastFetch, setLastFetch] = useState(0);

  // Memoize the fetch function to maintain its identity between renders
  const fetchSourceData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Check if we have valid cached data
      const cacheKey = `internalExternalData_${year}_${month}`;
      const cachedDataString = sessionStorage.getItem(cacheKey);
      const cachedTimeString = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;
        
        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 100000) {
          const parsedData = JSON.parse(cachedDataString);
          setInternalData(parsedData.internal);
          setExternalData(parsedData.external);
          setLastFetch(cachedTime);
          setIsLoading(false);
          return;
        }
      }
      
      // If no valid cache or force refresh, fetch from API
      let url = `/analytic/metrics`;

      // Add year and month filters
      if (year !== "all" && year !== "") {
        url += (url.includes("?") ? "&" : "?") + `year=${year}`;
      }
      if (month !== "all" && month !== "") {
        url += (url.includes("?") ? "&" : "?") + `month=${month}`;
      }
          
      const response = await api.get(url);
      
      if (response.data && response.data.internalExternalHires) {
        const { internal, external, internalRate, externalRate } = response.data.internalExternalHires;
        
        const internalObj = {
          count: internal,
          percentage: Math.round(internalRate)
        };
        
        const externalObj = {
          count: external,
          percentage: Math.round(externalRate)
        };
        
        // Store in session storage with timestamp
        const dataToCache = {
          internal: internalObj,
          external: externalObj
        };
        
        sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        sessionStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());
        
        setInternalData(internalObj);
        setExternalData(externalObj);
        setLastFetch(new Date().getTime());
      }
    } catch (err) {
      console.error("Error fetching source data:", err);
      setError("Failed to load source data");
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  // Use effect for the initial fetch
  useEffect(() => {
    fetchSourceData();
  }, [fetchSourceData]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Internal vs External Hires</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span className="absolute mt-5 w-48 p-2 body-tiny text-teal bg-teal-soft rounded shadow-lg text-justify z-10">
              This card shows the percentage breakdown of internal(referral) vs external hires in your organization over time
              <br />
              Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never'}
            </span>
          )}
          {/* Optional refresh button */}
          {/* <button 
            onClick={() => fetchSourceData(true)} 
            className="text-xs text-blue-500 hover:underline"
          >
            Refresh
          </button> */}
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="px-10">
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="text-4xl font-semibold">{internalData.percentage}%</span>
            <span className="text-xl text-gray-600">-</span>
            <span className="text-4xl font-semibold">{externalData.percentage}%</span>
          </div>
        </div>
      )}
    </>
  );
};

export default InternalVsExternalHires;