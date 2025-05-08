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
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ApplicantStatusChart = ({ year, month, selectedPosition }) => { // Added selectedPosition prop
  const [requisitionData, setRequisitionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Construct the API URL with query parameters
      const url = `/analytic/graphs/requisition`;
      const params = {
        year,
        month,
      };

      if (selectedPosition && selectedPosition !== "") {
        params.position_id = selectedPosition; // Use position_id to match backend
      }

      const response = await api.get(url, { params });
      const data = response.data.requisition || [];

      // Transform month numbers to month names if necessary
      const processedData = data.map((item) => {
        if (item.month) {
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          return {
            ...item,
            label: monthNames[item.month - 1], // Convert month number to name
          };
        }
        return item;
      });

      setRequisitionData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching requisition data:", err);
      setError("Failed to load requisition data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [year, month, selectedPosition]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = {
    labels: requisitionData.map((d) => d.label || `${d.year}`),
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
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
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
        <h2 className="text-md font-semibold">Requisition Stats</h2>
      </div>

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