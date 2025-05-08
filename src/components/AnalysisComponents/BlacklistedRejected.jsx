import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import api from "../../services/api";
import { FaInfoCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip);

const BlacklistedRejected = ({ year, month }) => {
  const [blacklistReasons, setBlacklistReasons] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [lastFetch, setLastFetch] = useState(0);

  // Fetch data for blacklist and rejection reasons
  const fetchReasonsData = useCallback(async (forceRefresh = false) => {
    try {
      const cacheKey = `blacklistRejectionData_${year}_${month}`;
      const cachedDataString = sessionStorage.getItem(cacheKey);
      const cachedTimeString = sessionStorage.getItem(`${cacheKey}_timestamp`);

      if (!forceRefresh && cachedDataString && cachedTimeString) {
        const cachedTime = parseInt(cachedTimeString);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cachedTime;

        // Cache valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          const parsedData = JSON.parse(cachedDataString);
          setBlacklistReasons(parsedData.reasonForBlacklisted);
          setRejectionReasons(parsedData.reasonForRejection);
          setLastFetch(cachedTime);
          return;
        }
      }

      // Fetch data from API
      const response = await api.get(`/analytic/metrics/reason-for-blacklisted`, {
        params: { year, month },
      });

      const blacklistData = response.data.reasonForBlacklisted;
      const rejectionData = response.data.reasonForRejection;

      // Store in session storage with timestamp
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ reasonForBlacklisted: blacklistData, reasonForRejection: rejectionData })
      );
      sessionStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());

      setBlacklistReasons(blacklistData);
      setRejectionReasons(rejectionData);
      setLastFetch(new Date().getTime());
    } catch (error) {
      console.error("Error fetching blacklist and rejection reasons:", error);
    }
  }, [year, month]);

  // Fetch data on component mount
  useEffect(() => {
    fetchReasonsData();
  }, [fetchReasonsData]);

  // Prepare chart data for blacklist reasons
  const blacklistChartData = useMemo(() => {
    return {
      labels: blacklistReasons.map((entry) => entry.reason),
      datasets: [
        {
          data: blacklistReasons.map((entry) => entry.count),
          backgroundColor: ["#008080", "#33A3A3", "#66C5C5", "#99E6E6", "#CCF2F2"],
          hoverBackgroundColor: ["#006666", "#2A8888", "#55A8A8", "#77BCBC", "#AACBCB"],
        },
      ],
    };
  }, [blacklistReasons]);

  // Prepare chart data for rejection reasons
  const rejectionChartData = useMemo(() => {
    return {
      labels: rejectionReasons.map((entry) => entry.reason),
      datasets: [
        {
          data: rejectionReasons.map((entry) => entry.count),
          backgroundColor: ["#800000", "#A33333", "#C56666", "#E69999", "#F2CCCC"],
          hoverBackgroundColor: ["#660000", "#882A2A", "#AA5555", "#CC7777", "#EEAAAA"],
        },
      ],
    };
  }, [rejectionReasons]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${percentage}% (${value})`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Blacklist & Rejection Reasons</h3>
        <div className="relative flex-col flex items-end gap-1">
          <FaInfoCircle
            className="cursor-pointer"
            title="This card shows the reasons for blacklisting and rejection."
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Blacklist Reasons Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Blacklist Reasons</h4>
          {blacklistReasons.length > 0 ? (
            <>
              <div className="mx-auto w-1/2">
                <Pie data={blacklistChartData} options={chartOptions} />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {blacklistReasons.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: blacklistChartData.datasets[0].backgroundColor[index % 5],
                      }}
                    />
                    <span className="text-sm text-gray-700">{entry.reason}</span>
                    <span className="ml-auto text-sm font-medium">{entry.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Rejection Reasons Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Rejection Reasons</h4>
          {rejectionReasons.length > 0 ? (
            <>
              <div className="mx-auto w-1/2">
                <Pie data={rejectionChartData} options={chartOptions} />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {rejectionReasons.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: rejectionChartData.datasets[0].backgroundColor[index % 5],
                      }}
                    />
                    <span className="text-sm text-gray-700">{entry.reason}</span>
                    <span className="ml-auto text-sm font-medium">{entry.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BlacklistedRejected;