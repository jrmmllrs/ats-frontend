import React, { useState, useEffect, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import api from "../../api/axios";

const TopJobPositions = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [jobPositions, setJobPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);

  // Memoize the fetch function to maintain its identity between renders
  const fetchTopJobs = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Check if we have valid cached data
      const cachedDataString = sessionStorage.getItem('topJobsData');
      const cachedTimeString = sessionStorage.getItem('topJobsDataTimestamp');
      
      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;
        
        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          const parsedData = JSON.parse(cachedDataString);
          setJobPositions(parsedData);
          setLastFetch(cachedTime);
          setIsLoading(false);
          return;
        }
      }
      
      // If no valid cache or force refresh, fetch from API
      const response = await api.get("/analytic/metrics");
      
      if (response.data && response.data.topJobs && response.data.topJobs.formattedTopJobs) {
        // Transform the data to match our component's expected format
        const formattedJobs = response.data.topJobs.formattedTopJobs.map(job => ({
          title: job.title,
          percentage: parseFloat(job.percentage.replace('%', '')), // Remove % sign and convert to number
          count: job.hires
        }));
        
        // Store in session storage with timestamp
        sessionStorage.setItem('topJobsData', JSON.stringify(formattedJobs));
        sessionStorage.setItem('topJobsDataTimestamp', new Date().getTime().toString());
        
        setJobPositions(formattedJobs);
        setLastFetch(new Date().getTime());
      }
    } catch (err) {
      console.error("Error fetching top job positions:", err);
      setError("Failed to load top job positions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use effect for the initial fetch
  useEffect(() => {
    fetchTopJobs();
  }, [fetchTopJobs]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Top Applied Jobs</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span className="absolute mt-5 w-48 p-2 body-tiny text-teal bg-teal-soft rounded shadow-lg text-justify z-10">
              This is a breakdown of the most frequently applied job positions by candidates
              <br />
              Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never'}
            </span>
          )}
          {/* Optional refresh button */}
          {/* <button 
            onClick={() => fetchTopJobs(true)} 
            className="text-xs text-blue-500 hover:underline"
          >
            Refresh
          </button> */}
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading job data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : jobPositions.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No job position data available</div>
      ) : (
        <div className="space-y-4 py-2">
          {jobPositions.map((position, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{position.title}</span>
              </div>
              <span className="font-semibold display">{position.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TopJobPositions;