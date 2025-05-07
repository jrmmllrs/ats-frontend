import { useState, useEffect } from "react"
import {
  FiUsers,
  FiBriefcase,
  FiRefreshCw,
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiCalendar,
} from "react-icons/fi"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Import your components
import TopJobPositions from "../components/AnalysisComponents/TopJobPositions"
import InternalVsExternalHires from "../components/AnalysisComponents/InternalVsExternalHires"
import CandidateDropOffRate from "../components/AnalysisComponents/CandidateDropOffRate"
import ApplicationReceived from "../components/AnalysisComponents/ApplicationReceived"
import ApplicantStatusChart from "../components/AnalysisComponents/RequisitionAnalysisGraph"
import SourceOfApplication from "../components/AnalysisComponents/SourceOfApplication"
import HiringFunnelChart from "../components/AnalysisComponents/HiringFunnelChart"
import BlacklistedRejected from "../components/AnalysisComponents/BlacklistedRejected"

import FilterControls from "../components/Analysis/FilterControls"
import Card from "../components/Analysis/Card"
import ChartCard from "../components/Analysis/ChartCard"
import Overlay from "../components/Analysis/Overlay"
import Skeleton from "../components/Analysis/Skeleton"

import api from "../services/api"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Updated color palette with #008080 as primary
const COLORS = [
  "#008080", // Primary teal
  "#006666", // Darker teal
  "#00A0A0", // Lighter teal
  "#00C0C0", // Very light teal
  "#004D4D", // Dark teal
  "#00E0E0", // Bright teal
  "#002B2B"  // Very dark teal
]

const AnalysisPage = () => {
  const [expandedCard, setExpandedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [positionsFilter, setPositionsFilter] = useState(null)

  // State for all dashboard data
  const [summaryData, setSummaryData] = useState(null)
  const [statusDistribution, setStatusDistribution] = useState([])
  const [sourceDistribution, setSourceDistribution] = useState([])
  const [applicationSource, setApplicationSource] = useState([])
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [jobPositions, setJobPositions] = useState([])
  const [hiringFunnel, setHiringFunnel] = useState(null)
  const [recentApplicants, setRecentApplicants] = useState([])
  const [interviewSchedule, setInterviewSchedule] = useState([])
  const [rejection, setRejection] = useState([])
  const [blacklisted, setBlacklisted] = useState([])

  const fetchPositions = async () => {
    try {
      const response = await api.get(`/company/positions/all`)
      setPositionsFilter(response.data.positions || [])
    } catch (error) {
      console.error("Error fetching job positions:", error)
      setPositionsFilter([])
    }
  }

  // Helper function to get month name
  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[monthNum - 1]
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append("year", year);
      if (month) queryParams.append("month", month);
      if (selectedPosition) queryParams.append("position_id", selectedPosition);
      const queryString = queryParams.toString();
  
      const [
        summaryResponse,
        statusResponse,
        sourceResponse,
        applicationSourceResponse,
        monthlyResponse,
        jobsResponse,
        applicantsResponse,
        funnelResponse,
        interviewResponse,
        blacklistedResponse,
        rejectionResponse
      ] = await Promise.all([
        api.get(`/analytics/dashboard/summary?${queryString}`),
        api.get(`/analytics/dashboard/status-distribution?${queryString}`),
        api.get(`/analytics/dashboard/source-distribution?${queryString}`),
        api.get(`/analytics/dashboard/application-source?${queryString}`),
        api.get(`/analytics/dashboard/monthly-trends?${queryString}`),
        api.get(`/analytics/dashboard/job-positions?${queryString}`),
        api.get(`/analytics/dashboard/recent-applicants?${queryString}`),
        api.get(`/analytics/dashboard/hiring-funnel?${queryString}`),
        api.get(`/analytics/dashboard/interview-schedule?${queryString}`),
        api.get(`/analytic/metrics/reason-for-blacklisted?${queryString}`),
        api.get(`/analytic/metrics/reason-for-rejection?${queryString}`),
      ]);
  
      setSummaryData(summaryResponse.data.data);
      setStatusDistribution(statusResponse.data.data);
      setSourceDistribution(sourceResponse.data.data);
      setApplicationSource(applicationSourceResponse.data.data);
      setMonthlyTrends(monthlyResponse.data.data);
      setJobPositions(jobsResponse.data.data);
      setRecentApplicants(applicantsResponse.data.data);
      setHiringFunnel(funnelResponse.data.data);
      setInterviewSchedule(interviewResponse.data.data);
      setRejection(rejectionResponse.data.reason_for_rejection);
      setBlacklisted(blacklistedResponse.data.reason_for_blacklisted);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await fetchPositions()
        await fetchDashboardData()
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, month, selectedPosition])

  const replaceText = (text) => {
    return text ? text.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Null"
  }

  // Prepare data for monthly trends chart
  const monthlyTrendsChartData = {
    labels: monthlyTrends.map((item) => getMonthName(item.month)),
    datasets: [
      {
        label: "Applicants",
        data: monthlyTrends.map((item) => item.applicant_count),
        fill: true,
        backgroundColor: "rgba(0, 128, 128, 0.2)",
        borderColor: "#008080",
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#008080",
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Hired",
        data: monthlyTrends.map((item) => item.hired_count),
        fill: true,
        backgroundColor: "rgba(0, 96, 96, 0.2)",
        borderColor: "#006666",
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#006666",
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Modern header with filter controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Recruitment Analytics</h1>
            <p className="text-gray-500 mt-1">
              {selectedPosition ? `Showing data for ${selectedPosition}` : "Company-wide overview"}
            </p>
          </div>
          <FilterControls
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            positionsFilter={positionsFilter}
            fetchDashboardData={fetchDashboardData}
          />
        </div>
      </div>

      <Overlay expandedCard={expandedCard} setExpandedCard={setExpandedCard} />

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${expandedCard ? "z-0" : ""}`}>
        <Card
          id="applications"
          title="Applications Received"
          icon={<FiUsers className="h-5 w-5 text-teal-600" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          selectedPosition={selectedPosition}
          className="bg-neutral-50"
        >
          <ApplicationReceived 
            year={year} 
            month={month} 
            selectedPosition={selectedPosition} 
            isExpanded={expandedCard === "applications"} 
          />
        </Card>

        <Card
          id="dropoff"
          title="Candidate Drop-off Rate"
          icon={<FiTrendingDown className="h-5 w-5 text-teal-500" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          selectedPosition={selectedPosition}
          className="bg-neutral-50"
        >
          <CandidateDropOffRate 
            year={year} 
            month={month} 
            selectedPosition={selectedPosition} 
            isExpanded={expandedCard === "dropoff"} 
          />
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="space-y-6">
        {/* Requisition Analysis - Full width */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Requisition Analysis</h2>
                <p className="text-sm text-gray-500">Detailed breakdown of applicant status</p>
              </div>
              <FiBarChart2 className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="w-full h-[400px]">
              <ApplicantStatusChart 
                year={year} 
                month={month} 
                selectedPosition={selectedPosition} 
              />
            </div>
          </div>
        </div>

        {/* Two-column charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Hiring Funnel */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Hiring Funnel</h2>
                  <p className="text-sm text-gray-500">Applicants at each stage</p>
                </div>
                <FiUsers className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ) : (
                <div className="h-[400px]">
                  <HiringFunnelChart 
                    data={hiringFunnel} 
                    colors={COLORS}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Monthly Trends</h2>
                  <p className="text-sm text-gray-500">Applications and hires by month</p>
                </div>
                <FiBarChart2 className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ) : (
                <div className="h-[400px]">
                  <Line
                    data={monthlyTrendsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: "#4B5563"
                          }
                        },
                        tooltip: {
                          mode: "index",
                          intersect: false,
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14, weight: "bold" },
                          bodyFont: { size: 12 },
                          padding: 12,
                          cornerRadius: 8
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0,0,0,0.05)"
                          },
                          ticks: {
                            color: "#4B5563"
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: "#4B5563"
                          }
                        }
                      },
                      elements: {
                        line: {
                          tension: 0.3
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* First row of two pie charts */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Applicant Sources */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Applicant Sources</h2>
                  <p className="text-sm text-gray-500">Where applicants applied from</p>
                </div>
                <FiPieChart className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[250px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[200px] flex justify-center">
                    <Pie
                      data={{
                        labels: applicationSource?.length > 0 
                          ? applicationSource.map((item) => replaceText(item.applied_source)) 
                          : ["No Data"],
                        datasets: [
                          {
                            data: applicationSource?.length > 0 
                              ? applicationSource.map((item) => item.count) 
                              : [1],
                            backgroundColor: COLORS,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 12,
                              usePointStyle: true,
                              font: {
                                size: 11
                              },
                              color: "#4B5563"
                            }
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.8)",
                            titleFont: { size: 12, weight: "bold" },
                            bodyFont: { size: 11 },
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                              label: (context) => {
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${context.label}: ${value} (${percentage}%)`
                              },
                            },
                          },
                        },
                        cutout: expandedCard === "applicationSource" ? '50%' : '70%'
                      }}
                    />
                  </div>
                  {expandedCard === "applicationSource" && (
                    <div className="mt-2">
                      <ul className="space-y-2 text-sm">
                        {applicationSource?.length > 0 ? (
                          applicationSource.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{replaceText(item.applied_source)}</span>
                              </div>
                              <span className="font-medium">{item.count}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No data available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Source of Application */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Discovery Sources</h2>
                  <p className="text-sm text-gray-500">How applicants found us</p>
                </div>
                <FiPieChart className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[250px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[200px] flex justify-center">
                    <Pie
                      data={{
                        labels: sourceDistribution?.length > 0 
                          ? sourceDistribution.map((item) => replaceText(item.applied_source)) 
                          : ["No Data"],
                        datasets: [
                          {
                            data: sourceDistribution?.length > 0 
                              ? sourceDistribution.map((item) => item.count) 
                              : [1],
                            backgroundColor: COLORS,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 12,
                              usePointStyle: true,
                              font: {
                                size: 11
                              },
                              color: "#4B5563"
                            }
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.8)",
                            titleFont: { size: 12, weight: "bold" },
                            bodyFont: { size: 11 },
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                              label: (context) => {
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${context.label}: ${value} (${percentage}%)`
                              },
                            },
                          },
                        },
                        cutout: expandedCard === "source" ? '50%' : '70%'
                      }}
                    />
                  </div>
                  {expandedCard === "source" && (
                    <div className="mt-2">
                      <ul className="space-y-2 text-sm">
                        {sourceDistribution?.length > 0 ? (
                          sourceDistribution.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{replaceText(item.applied_source)}</span>
                              </div>
                              <span className="font-medium">{item.count}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No data available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second row of two pie charts */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Rejection Reasons */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Rejection Reasons</h2>
                  <p className="text-sm text-gray-500">Why candidates were rejected</p>
                </div>
                <FiPieChart className="h-5 w-5 text-teal-500" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[250px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[200px] flex justify-center">
                    <Pie
                      data={{
                        labels: rejection?.length > 0 
                          ? rejection.map((item) => replaceText(item.reason)) 
                          : ["No Data"],
                        datasets: [
                          {
                            data: rejection?.length > 0 
                              ? rejection.map((item) => item.count) 
                              : [1],
                            backgroundColor: COLORS,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 12,
                              usePointStyle: true,
                              font: {
                                size: 11
                              },
                              color: "#4B5563"
                            }
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.8)",
                            titleFont: { size: 12, weight: "bold" },
                            bodyFont: { size: 11 },
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                              label: (context) => {
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${context.label}: ${value} (${percentage}%)`
                              },
                            },
                          },
                        },
                        cutout: expandedCard === "rejection" ? '50%' : '70%'
                      }}
                    />
                  </div>
                  {expandedCard === "rejection" && (
                    <div className="mt-2">
                      <ul className="space-y-2 text-sm">
                        {rejection?.length > 0 ? (
                          rejection.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{replaceText(item.reason)}</span>
                              </div>
                              <span className="font-medium">{item.count}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No data available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Blacklisted Reasons */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Blacklist Reasons</h2>
                  <p className="text-sm text-gray-500">Why candidates were blacklisted</p>
                </div>
                <FiPieChart className="h-5 w-5 text-teal-500" />
              </div>
            </div>
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="w-full h-[250px] flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[200px] flex justify-center">
                    <Pie
                      data={{
                        labels: blacklisted?.length > 0 
                          ? blacklisted.map((item) => replaceText(item.reason)) 
                          : ["No Data"],
                        datasets: [
                          {
                            data: blacklisted?.length > 0 
                              ? blacklisted.map((item) => item.count) 
                              : [1],
                            backgroundColor: COLORS,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 12,
                              usePointStyle: true,
                              font: {
                                size: 11
                              },
                              color: "#4B5563"
                            }
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.8)",
                            titleFont: { size: 12, weight: "bold" },
                            bodyFont: { size: 11 },
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                              label: (context) => {
                                const value = context.raw || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${context.label}: ${value} (${percentage}%)`
                              },
                            },
                          },
                        },
                        cutout: expandedCard === "blacklisted" ? '50%' : '70%'
                      }}
                    />
                  </div>
                  {expandedCard === "blacklisted" && (
                    <div className="mt-2">
                      <ul className="space-y-2 text-sm">
                        {blacklisted?.length > 0 ? (
                          blacklisted.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{replaceText(item.reason)}</span>
                              </div>
                              <span className="font-medium">{item.count}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No data available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage