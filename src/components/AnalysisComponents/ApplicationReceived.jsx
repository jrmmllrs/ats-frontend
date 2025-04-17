import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../api/axios";
import { FaInfoCircle } from "react-icons/fa";

const ApplicationReceived = ({ year, month }) => { // Receive year and month props
  const [totalApplications, setTotalApplications] = useState(0);
  const [monthsData, setMonthsData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);

  // Memoize the fetch function to maintain its identity between renders
  const fetchApplicationData = useCallback(async (forceRefresh = false) => {
    try {
      // Check if we have valid cached data
      const cacheKey = `applicationData_${year}_${month}`;
      const cachedDataString = sessionStorage.getItem(cacheKey);
      const cachedTimeString = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;
        
        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          const parsedData = JSON.parse(cachedDataString);
          setTotalApplications(parsedData.total);
          setMonthsData(parsedData.breakdown);
          setLastFetch(cachedTime);
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
      const data = response.data.applicationsReceived;

      // Store in session storage with timestamp
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      sessionStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());

      setTotalApplications(data.total);
      setMonthsData(data.breakdown);
      setLastFetch(new Date().getTime());
    } catch (error) {
      console.error("Error fetching application metrics:", error);
    }
  }, [year, month]);

  // Use effect for the initial fetch
  useEffect(() => {
    fetchApplicationData();
  }, [fetchApplicationData]);

  // Memoize the application data based on last fetch time
  const applicationData = useMemo(() => {
    return {
      total: totalApplications,
      months: monthsData,
      lastUpdated: lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never'
    };
  }, [totalApplications, monthsData, lastFetch]);

  // Memoize the formatted months to avoid recalculation on every render
  const months = useMemo(() => {
    return monthsData.map((item) => {
      // Convert YYYY-MM format to month name
      const [year, month] = item.month.split('-');
      const date = new Date(year, month - 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      
      return { 
        name: monthName, 
        count: item.count 
      };
    });
  }, [monthsData]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Application Received</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span className="absolute mt-5 w-48 p-2 body-tiny text-teal bg-teal-soft rounded shadow-lg text-justify">
              This card shows the number of applications received.
              <br />
              Last updated: {applicationData.lastUpdated}
            </span>
          )}
          {/* Optional refresh button */}
          {/* <button 
            onClick={() => fetchApplicationData(true)} 
            className="text-xs text-blue-500 hover:underline"
          >
            Refresh
          </button> */}
        </div>
      </div>

      <p className="mb-6 text-center text-4xl font-semibold">
        {applicationData.total}
      </p>

      <div className="space-y-2">
        {months.map((month, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-medium">{month.name}</span>
            <span className="font-medium">{month.count}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ApplicationReceived;