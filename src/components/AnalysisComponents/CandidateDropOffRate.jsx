import React, { useState, useEffect, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import api from "../../api/axios";

const CandidateDropOffRate = ({ year, month, isExpanded }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallRate, setOverallRate] = useState(0);
  const [monthlyRates, setMonthlyRates] = useState({});
  const [lastFetch, setLastFetch] = useState(0);

  // Memoize the fetch function to maintain its identity between renders
  const fetchDropOffData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Check if we have valid cached data
      const cacheKey = `dropOffRateData_${year}_${month}`;
      const cachedDataString = sessionStorage.getItem(cacheKey);
      const cachedTimeString = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;
        
        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          const parsedData = JSON.parse(cachedDataString);
          setOverallRate(parsedData.overallRate);
          setMonthlyRates(parsedData.monthlyRates);
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
      
      if (response.data && response.data.dropOffRate) {
        const { overallDropOffRate, monthlyDropOffs } = response.data.dropOffRate;
        
        // Set overall rate
        setOverallRate(parseFloat(overallDropOffRate));
        
        // Transform monthly data into expected format
        const formattedMonthlyRates = {};
        monthlyDropOffs.forEach(item => {
          const [year, month] = item.month.split('-');
          const date = new Date(year, month - 1);
          const monthName = date.toLocaleString('default', { month: 'long' });
          
          formattedMonthlyRates[monthName] = parseFloat(item.dropOffRate);
        });
        
        setMonthlyRates(formattedMonthlyRates);
        
        // Store in session storage with timestamp
        const dataToCache = {
          overallRate: parseFloat(overallDropOffRate),
          monthlyRates: formattedMonthlyRates
        };
        
        sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        sessionStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());
        
        setLastFetch(new Date().getTime());
      }
    } catch (err) {
      console.error("Error fetching drop-off rate data:", err);
      setError("Failed to load drop-off rate data");
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  // Use effect for the initial fetch
  useEffect(() => {
    fetchDropOffData();
  }, [fetchDropOffData]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Drop-Off Rate</h3>
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
              Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never'}
            </span>
          )}
          {/* Optional refresh button */}
          {/* <button 
            onClick={() => fetchDropOffData(true)} 
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
        <>
          <div className="mb-6 text-center text-4xl font-semibold">
            {overallRate}%
          </div>
          {Object.keys(monthlyRates).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(monthlyRates)
                .sort((a, b) => {
                  // Sort months in reverse chronological order
                  const months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ];
                  return months.indexOf(b[0]) - months.indexOf(a[0]);
                })
                .slice(0, isExpanded ? undefined : 3)
                .map(([month, rate]) => (
                  <div key={month} className="flex justify-between">
                    <span className="font-medium">{month}</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No monthly data available</div>
          )}
        </>
      )}
    </>
  );
};

export default CandidateDropOffRate;