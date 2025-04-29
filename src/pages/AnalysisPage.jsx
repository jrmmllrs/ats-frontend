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

import api from "../api/axios"

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

// Helper function to get month name
const getMonthName = (monthNum) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[monthNum - 1]
}

// Custom colors for charts - teal palette
const COLORS = ["#004040", "#006060", "#008080", "#00a0a0", "#00bfbf", "#e0f7fa", "#e6ffff"]

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

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (year) queryParams.append("year", year)
      if (month) queryParams.append("month", month)
      const queryString = queryParams.toString()

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
        rejectionResponse,
      ] = await Promise.all([
        api.get(`/analytics/dashboard/summary?${queryString}`),
        api.get(`/analytics/dashboard/status-distribution?${queryString}`),
        api.get(`/analytics/dashboard/source-distribution?${queryString}`),
        api.get(`/analytics/dashboard/application-source?${queryString}`),
        api.get(`/analytics/dashboard/monthly-trends?year=${year}`),
        api.get(`/analytics/dashboard/job-positions?${queryString}`),
        api.get(`/analytics/dashboard/recent-applicants?${queryString}`),
        api.get(`/analytics/dashboard/hiring-funnel?${queryString}`),
        api.get(`/analytics/dashboard/interview-schedule?${queryString}`),
        api.get(`/analytic/metrics?${queryString}`),
      ])

      setSummaryData(summaryResponse.data.data)
      setStatusDistribution(statusResponse.data.data)
      setSourceDistribution(sourceResponse.data.data)
      setApplicationSource(applicationSourceResponse.data.data)
      setMonthlyTrends(monthlyResponse.data.data)
      setJobPositions(jobsResponse.data.data)
      setRecentApplicants(applicantsResponse.data.data)
      setHiringFunnel(funnelResponse.data.data)
      setInterviewSchedule(interviewResponse.data.data)
      setRejection(rejectionResponse.data.reasonForRejection)
      setBlacklisted(rejectionResponse.data.reasonForBlacklisted)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

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
  }, [year, month])

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
        borderColor: "rgba(0, 128, 128, 1)",
        tension: 0.4,
      },
      {
        label: "Hired",
        data: monthlyTrends.map((item) => item.hired_count),
        fill: true,
        backgroundColor: "rgba(0, 96, 96, 0.2)",
        borderColor: "rgba(0, 96, 96, 1)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 p-2 xs:p-4 sm:p-6 min-h-screen">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>

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

      <Overlay expandedCard={expandedCard} setExpandedCard={setExpandedCard} />

      {/* Top row with 4 equal cards */}
      <div className={`grid grid-cols-1 gap-3 xs:gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 ${expandedCard ? "z-0" : ""}`}>
        <Card 
          id="applications" 
          title="Applications Received" 
          icon={<FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          <ApplicationReceived year={year} month={month} isExpanded={expandedCard === "applications"} />
        </Card>

        <Card 
          id="positions" 
          title="Top Job Positions" 
          icon={<FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          <TopJobPositions jobPositions={jobPositions} loading={loading} year={year} month={month} isExpanded={expandedCard === "positions"} />
        </Card>

        <Card 
          id="hires" 
          title="Internal vs External Hires" 
          icon={<FiRefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          <InternalVsExternalHires year={year} month={month} />
        </Card>

        <Card 
          id="dropoff" 
          title="Candidate Drop-off Rate" 
          icon={<FiTrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          <CandidateDropOffRate year={year} month={month} isExpanded={expandedCard === "dropoff"} />
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Job Position Analytics */}
        <ChartCard
          id="positionAnalytics"
          title="Top Job Positions"
          subtitle="Applicants by job position"
          icon={<FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="w-full h-[600px]">
              <Bar
                data={{
                  labels: jobPositions.map((item) => item.title),
                  datasets: [
                    {
                      label: "Applicants",
                      data: jobPositions.map((item) => item.applicant_count),
                      backgroundColor: "rgba(0, 128, 128, 0.8)",
                    },
                    {
                      label: "Hired",
                      data: jobPositions.map((item) => item.hired_count),
                      backgroundColor: "rgba(0, 96, 96, 0.8)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 11,
                        },
                        callback: function (value) {
                          const label = this.getLabelForValue(value)
                          return label.split(' ')
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </ChartCard>

        {/* Hiring Funnel Chart */}
        <ChartCard
          id="hiringFunnel"
          title="Hiring Funnel"
          subtitle="Applicants at each stage of the hiring process"
          icon={<FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[600px]">
              <HiringFunnelChart data={hiringFunnel} />
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom row with 2 cards */}
      <div className={`grid grid-cols-1 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:grid-cols-4 ${expandedCard ? "z-0" : ""}`}>
        <div className="lg:col-span-2">
          <ChartCard
            id="requisition"
            title="Requisition Analysis"
            subtitle="Requisition Data"
            icon={<FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
          >
            <div className="w-full h-[400px]">
              <ApplicantStatusChart year={year} month={month} className />
            </div>
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
          {/* Monthly Trends Chart */}
          <ChartCard
            id="monthlyTrends"
            title="Monthly Applicant Trends"
            subtitle="Applications and hires by month"
            icon={<FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
          >
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
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
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Source Distribution */}
        <ChartCard
          id="applicationSource"
          title="Applicant Sources"
          subtitle="Where applicants applied from"
          icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div>
              <div className="h-[300px] flex justify-center">
                <Pie
                  data={{
                    labels: applicationSource && applicationSource.length > 0 ? applicationSource.map((item) => replaceText(item.applied_source)) : ["No Data"],
                    datasets: [
                      {
                        label: "Applicants",
                        data: applicationSource && applicationSource.length > 0 ? applicationSource.map((item) => item.count) : [1],
                        backgroundColor: COLORS.map((color) => `${color}`),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = Math.round((value / total) * 100)
                            return `${percentage}%`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              {expandedCard === "applicationSource" && (
                applicationSource && applicationSource.length > 0 ? (
                  <ul className="mt-4 text-sm text-gray-600">
                    {applicationSource.map((item, index) => (
                      <li key={index}>
                        {replaceText(item.applied_source)}: {item.count}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">No Data</p>
                )
              )}
            </div>
          )}
        </ChartCard>

        <ChartCard
          id="source"
          title="Source of Application"
          subtitle="Where applicants discovered this"
          icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div>
              <div className="h-[300px] flex justify-center">
                <Pie
                  data={{
                    labels: sourceDistribution && sourceDistribution.length > 0 ? sourceDistribution.map((item) => replaceText(item.applied_source)) : ["No Data"],
                    datasets: [
                      {
                        label: "Applicants",
                        data: sourceDistribution && sourceDistribution.length > 0 ? sourceDistribution.map((item) => item.count) : [1],
                        backgroundColor: COLORS.map((color) => `${color}`),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = Math.round((value / total) * 100)
                            return `${percentage}%`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              {expandedCard === "source" && (
                sourceDistribution && sourceDistribution.length > 0 ? (
                  <ul className="mt-4 text-sm text-gray-600">
                    {sourceDistribution.map((item, index) => (
                      <li key={index}>
                        {replaceText(item.applied_source)}: {item.count}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">No Data</p>
                )
              )}
            </div>
          )}
        </ChartCard>

        <ChartCard
          id="rejection"
          title="Rejected"
          subtitle="Reason for Rejection"
          icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div>
              <div className="h-[300px] flex justify-center">
                <Pie
                  data={{
                    labels: rejection && rejection.length > 0 ? rejection.map((item) => replaceText(item.reason)) : ["No Data"],
                    datasets: [
                      {
                        label: "Rejection",
                        data: rejection && rejection.length > 0 ? rejection.map((item) => item.count) : [1],
                        backgroundColor: COLORS.map((color) => `${color}`),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = Math.round((value / total) * 100)
                            return `${percentage}%`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              {expandedCard === "rejection" && (
                rejection && rejection.length > 0 ? (
                  <ul className="mt-4 text-sm text-gray-600">
                    {rejection.map((item, index) => (
                      <li key={index}>
                        {replaceText(item.reason)}: {item.count}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">No Data</p>
                )
              )}
            </div>
          )}
        </ChartCard>

        <ChartCard
          id="blacklisted"
          title="Blacklisted"
          subtitle="Reason for Blacklisted"
          icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div>
              <div className="h-[300px] flex justify-center">
                <Pie
                  data={{
                    labels: blacklisted && blacklisted.length > 0 ? blacklisted.map((item) => replaceText(item.reason)) : ["No Data"],
                    datasets: [
                      {
                        label: "Rejection",
                        data: blacklisted && blacklisted.length > 0 ? blacklisted.map((item) => item.count) : [1],
                        backgroundColor: COLORS.map((color) => `${color}`),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = Math.round((value / total) * 100)
                            return `${percentage}%`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              {expandedCard === "blacklisted" && (
                blacklisted && blacklisted.length > 0 ? (
                  <ul className="mt-4 text-sm text-gray-600">
                    {blacklisted.map((item, index) => (
                      <li key={index}>
                        {replaceText(item.reason)}: {item.count}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">No Data</p>
                )
              )}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

export default AnalysisPage