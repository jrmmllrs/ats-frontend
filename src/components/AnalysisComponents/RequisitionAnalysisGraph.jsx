import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ExportOptions from "./ExportOptions";
import api from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ApplicantStatusChart = ({ year, month }) => { // Receive year and month props
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [requisitionData, setRequisitionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);

  // Generate a cache key based on the current filters
  const getCacheKey = useCallback(() => {
    return `requisitionData_year_${year}_month_${month}`;
  }, [year, month]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const cacheKey = getCacheKey();
      const cacheTimeKey = `${cacheKey}_timestamp`;

      // Check if we have valid cached data
      const cachedDataString = sessionStorage.getItem(cacheKey);
      const cachedTimeString = sessionStorage.getItem(cacheTimeKey);

      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;

        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          const processedData = JSON.parse(cachedDataString);
          setRequisitionData(processedData);
          setLastFetch(cachedTime);
          setLoading(false);
          return;
        }
      }

      // If no valid cache or force refresh, fetch from API
      let url = `/analytic/graphs/requisition`;

      // Build query parameters object based on the API's expected format
      let params = {};

      // Add year filter directly (not as filter_year)
      if (year && year !== "all" && year !== "") {
        params.year = year;
      }

      // Add month filter directly (not as filter_month)
      if (month && month !== "all" && month !== "") {
        params.month = month;
      }

      // Log the request details for debugging
      console.log("Fetching requisition data with params:", params);

      // Make the API request with params
      const response = await api.get(url, { params });
      console.log("API Response:", response.data);

      // Use the data directly from the response
      let processedData = response.data.requisition || [];

      // If we have data but it's not showing proper labels for months, let's transform it
      if (processedData.length > 0) {
        // Ensure months have proper labels if they're numeric
        processedData = processedData.map(item => {
          // If label is just a number (month number), convert to month name
          if (!isNaN(parseInt(item.label)) && parseInt(item.label) >= 1 && parseInt(item.label) <= 12) {
            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            const monthIndex = parseInt(item.label) - 1;
            return {
              ...item,
              label: monthNames[monthIndex]
            };
          }
          return item;
        });
      }

      console.log("Processed data after modifications:", processedData);

      // Store in session storage with timestamp
      sessionStorage.setItem(cacheKey, JSON.stringify(processedData));
      sessionStorage.setItem(cacheTimeKey, new Date().getTime().toString());

      setRequisitionData(processedData);
      setLastFetch(new Date().getTime());
      setError(null);
    } catch (err) {
      console.error("Error fetching requisition data:", err);
      setError("Failed to load requisition data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [year, month, getCacheKey]);

  // Use effect for the initial fetch and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = {
    labels: requisitionData.map((d) => d.label),
    datasets: [
      {
        label: "Closed",
        data: requisitionData.map((d) => d.closed || 0),
        backgroundColor: "#008080",
      },
      {
        label: "Passed",
        data: requisitionData.map((d) => d.passed || 0),
        backgroundColor: "#33A3A3",
      },
      {
        label: "In Progress",
        data: requisitionData.map((d) => d.onProgress || 0),
        backgroundColor: "#66C5C5",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true, // Ensures the y-axis begins at zero
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-sm text-gray-500">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold">Requisition Stats</h2>


        </div>
        {/* <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="rounded bg-teal-600 px-3 py-1 text-sm text-white hover:bg-teal-700"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              Export
            </button>
            {showExportOptions && (
              <div className="absolute right-0 z-10 mt-1 w-40 rounded border bg-white shadow-lg">
                <ExportOptions
                  data={requisitionData}
                  onExportComplete={() => setShowExportOptions(false)}
                />
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Show chart even if all values are zero (empty data check is for completely empty response) */}
      {requisitionData.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="text-sm text-gray-500">No data available for the selected filters</div>
        </div>
      ) : (
        <div className="h-64 w-full">
          <Bar data={chartData} options={options} />
        </div>
      )}

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-md bg-gray-50 p-2">
            <p className="text-xs text-gray-500">Total Closed</p>
            <p className="text-lg font-semibold text-teal-600">
              {requisitionData.reduce((total, item) => total + (item.closed || 0), 0)}
            </p>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <p className="text-xs text-gray-500">Total Passed</p>
            <p className="text-lg font-semibold text-teal-600">
              {requisitionData.reduce((total, item) => total + (item.passed || 0), 0)}
            </p>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <p className="text-xs text-gray-500">In Progress</p>
            <p className="text-lg font-semibold text-teal-600">
              {requisitionData.reduce((total, item) => total + (item.onProgress || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantStatusChart;