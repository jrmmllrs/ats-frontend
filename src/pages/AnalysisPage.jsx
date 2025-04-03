import { useState, useEffect } from "react"
import {
  FiUsers,
  FiBriefcase,
  FiRefreshCw,
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiMaximize2,
  FiMinimize2,
  FiUserCheck,
  FiCalendar
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

// Custom Skeleton component
const Skeleton = ({ className = "" }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
}

const AnalysisPage = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // State for all dashboard data
  const [summaryData, setSummaryData] = useState(null)
  const [statusDistribution, setStatusDistribution] = useState([])
  const [sourceDistribution, setSourceDistribution] = useState([])
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [jobPositions, setJobPositions] = useState([])
  const [hiringFunnel, setHiringFunnel] = useState(null)
  const [recentApplicants, setRecentApplicants] = useState([])
  const [interviewSchedule, setInterviewSchedule] = useState([])
  const [timeToHire, setTimeToHire] = useState([])

  const internalHires = 30;
  const externalHires = 70;

  const overallRate = 10;
  const monthlyRates = {
    January: 5,
    February: 10,
    March: 15,
  };

  const totalApplications = 100;
  const months = [
    { name: "January", count: 30 },
    { name: "February", count: 40 },
    { name: "March", count: 30 },
  ];

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)

    try {
      // Replace fetch calls with axios calls
      const [
        summaryResponse,
        statusResponse,
        sourceResponse,
        monthlyResponse,
        jobsResponse,
        applicantsResponse,
        funnelResponse,
        interviewResponse,
        timeResponse,
      ] = await Promise.all([
        api.get("/analytics/dashboard/summary"),
        api.get("/analytics/dashboard/status-distribution"),
        api.get("/analytics/dashboard/source-distribution"),
        api.get(`/analytics/dashboard/monthly-trends?year=${year}`),
        api.get("/analytics/dashboard/job-positions"),
        api.get("/analytics/dashboard/recent-applicants"),
        api.get("/analytics/dashboard/hiring-funnel"),
        api.get("/analytics/dashboard/interview-schedule"),
        api.get("/analytics/dashboard/time-to-hire"),
      ])

      // Update state with fetched data (axios puts response in .data)
      setSummaryData(summaryResponse.data.data)
      setStatusDistribution(statusResponse.data.data)
      setSourceDistribution(sourceResponse.data.data)
      setMonthlyTrends(monthlyResponse.data.data)
      setJobPositions(jobsResponse.data.data)
      setRecentApplicants(applicantsResponse.data.data)
      setHiringFunnel(funnelResponse.data.data)
      setInterviewSchedule(interviewResponse.data.data)
      setTimeToHire(timeResponse.data.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [year])

  const requisitionData = [
    { month: "January", closed: 12, passed: 3, onProgress: 0 },
    { month: "February", closed: 4, passed: 2, onProgress: 0 },
    { month: "March", closed: 3, passed: 1, onProgress: 0 },
    { month: "April", closed: 4, passed: 2, onProgress: 0 },
    { month: "May", closed: 27, passed: 4, onProgress: 0 },
    { month: "June", closed: 14, passed: 2, onProgress: 0 },
    { month: "July", closed: 5, passed: 4, onProgress: 0 },
    { month: "August", closed: 0, passed: 0, onProgress: 11 },
    { month: "September", closed: 0, passed: 2, onProgress: 0 },
    { month: "October", closed: 0, passed: 0, onProgress: 21 },
    { month: "November", closed: 4, passed: 0, onProgress: 4 },
    { month: "December", closed: 0, passed: 0, onProgress: 1 },
  ];

  const sourceData = sourceDistribution.length > 0 ? 
    sourceDistribution.map(item => ({ name: item.applied_source, value: item.count })) : 
    [
      { name: "Referral", value: 50 },
      { name: "Website", value: 30 },
      { name: "Caravan", value: 20 },
    ];

  // Function to handle card expansion
  const toggleCardExpand = (id) => {
    const newExpandedState = expandedCard === id ? null : id;
    setExpandedCard(newExpandedState);

    // Toggle body scroll lock when card is expanded
    document.body.style.overflow = newExpandedState ? 'hidden' : 'auto';
  };

  // Card component with expansion functionality
  const Card = ({ id, title, icon, children, className = "" }) => {
    const isExpanded = expandedCard === id;
    const isAnyCardExpanded = expandedCard !== null;
    const shouldHide = isAnyCardExpanded && !isExpanded;

    return (
      <div
        className={`
        rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 ${className}
        ${isExpanded ?
            'fixed top-[10%] left-[10%] right-[10%] bottom-[10%] max-w-5xl mx-auto z-50' :
            'h-auto min-h-[12rem] xs:min-h-[13rem] sm:min-h-[15rem]'}
        ${shouldHide ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
        style={{
          boxShadow: isExpanded ?
            '0 10px 25px rgba(0, 0, 0, 0.1)' :
            '0 4px 12px rgba(0, 0, 0, 0.03)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          transform: shouldHide ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        <div className="flex items-center justify-between p-2 xs:p-3 sm:p-4 border-b border-opacity-10 border-gray-200">
          <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base font-medium text-gray-700">
            <span className="text-primary">{icon}</span>
            {title}
          </div>
          <button
            onClick={() => toggleCardExpand(id)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ?
              <FiMinimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> :
              <FiMaximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            }
          </button>
        </div>
        <div
          className={`p-2 xs:p-3 sm:p-4 ${isExpanded ? 'h-[calc(100%-60px)] overflow-y-auto' :
            'h-[calc(100%-40px)] xs:h-[calc(100%-44px)] sm:h-[calc(100%-56px)] custom-scrollbar'
            }`}
          style={{ overflowY: 'auto' }}
        >
          {children}
        </div>
      </div>
    );
  };

  // Prepare data for monthly trends chart
  const monthlyTrendsChartData = {
    labels: monthlyTrends.map((item) => getMonthName(item.month)),
    datasets: [
      {
        label: "Applicants",
        data: monthlyTrends.map((item) => item.applicant_count),
        fill: true,
        backgroundColor: "rgba(0, 128, 128, 0.2)", // teal with opacity
        borderColor: "rgba(0, 128, 128, 1)", // teal
        tension: 0.4,
      },
      {
        label: "Hired",
        data: monthlyTrends.map((item) => item.hired_count),
        fill: true,
        backgroundColor: "rgba(0, 96, 96, 0.2)", // darker teal with opacity
        borderColor: "rgba(0, 96, 96, 1)", // darker teal
        tension: 0.4,
      },
    ],
  }

  // Wrapper for chart cards to make them expandable
  const ChartCard = ({ id, title, subtitle, icon, children }) => {
    const isExpanded = expandedCard === id;
    const isAnyCardExpanded = expandedCard !== null;
    const shouldHide = isAnyCardExpanded && !isExpanded;

    return (
      <div
        className={`
          bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300
          ${isExpanded ?
              'fixed top-[10%] left-[10%] right-[10%] bottom-[10%] max-w-5xl mx-auto z-50' :
              'h-auto'}
          ${shouldHide ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        style={{
          boxShadow: isExpanded ?
            '0 10px 25px rgba(0, 0, 0, 0.1)' :
            '0 4px 12px rgba(0, 0, 0, 0.03)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          transform: shouldHide ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="text-primary">{icon}</span>
              <h3 className="text-base sm:text-lg">{title}</h3>
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={() => toggleCardExpand(id)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ?
              <FiMinimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> :
              <FiMaximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            }
          </button>
        </div>
        <div className={`p-4 sm:p-6 ${isExpanded ? 'h-[calc(100%-70px)] overflow-y-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 p-2 xs:p-4 sm:p-6 min-h-screen">
      <style jsx global>{`
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

      {/* Overlay for expanded card */}
      {expandedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center min-h-screen"
          onClick={() => {
            setExpandedCard(null);
            document.body.style.overflow = 'auto';
          }}
        />
      )}

      {/* Top row with 4 equal cards */}
      <div className={`grid grid-cols-1 gap-3 xs:gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 ${expandedCard ? 'z-0' : ''}`}>
        <Card id="applications" title="Applications Received" icon={<FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />}>
          <ApplicationReceived totalApplications={totalApplications} months={months} />
        </Card>

        <Card id="positions" title="Top Job Positions" icon={<FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5" />}>
          <TopJobPositions jobPositions={jobPositions} loading={loading} />
        </Card>

        <Card id="hires" title="Internal vs External Hires" icon={<FiRefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />}>
          <InternalVsExternalHires internalHires={internalHires} externalHires={externalHires} />
        </Card>

        <Card id="dropoff" title="Candidate Drop-off Rate" icon={<FiTrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}>
          <CandidateDropOffRate overallRate={overallRate} monthlyRates={monthlyRates} />
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends Chart */}
        <ChartCard 
          id="monthlyTrends" 
          title="Monthly Applicant Trends" 
          subtitle="Applications and hires by month"
          icon={<FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
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

        {/* Hiring Funnel Chart */}
        <ChartCard 
          id="hiringFunnel" 
          title="Hiring Funnel" 
          subtitle="Applicants at each stage of the hiring process"
          icon={<FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <HiringFunnelChart data={hiringFunnel} loading={loading} />
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom row with 2 cards */}
      <div className={`grid grid-cols-1 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3 ${expandedCard ? 'z-0' : ''}`}>
        <div className="lg:col-span-2">
          <Card
            id="requisition"
            title="Requisition Analysis"
            icon={<FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          >
            <ApplicantStatusChart data={requisitionData} />
          </Card>
        </div>
        <div>
          <Card
            id="source"
            title="Source of Applications"
            icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
          >
            <SourceOfApplication data={sourceData} />
          </Card>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Source Distribution */}
        <ChartCard
          id="sourceDistribution"
          title="Applicant Sources"
          subtitle="Where applicants are coming from"
          icon={<FiPieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px] flex justify-center">
              <Pie
                data={{
                  labels: sourceDistribution.map((item) => item.applied_source),
                  datasets: [
                    {
                      label: "Applicants",
                      data: sourceDistribution.map((item) => item.count),
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
                      display: true, // Hides the legend labels
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
          )}
        </ChartCard>
        
        {/* Job Position Analytics */}
        <ChartCard
          id="positionAnalytics"
          title="Top Job Positions"
          subtitle="Applicants by job position"
          icon={<FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5" />}
        >
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: jobPositions.map((item) => item.title),
                  datasets: [
                    {
                      label: "Applicants",
                      data: jobPositions.map((item) => item.applicant_count),
                      backgroundColor: "rgba(0, 128, 128, 0.8)", // teal
                    },
                    {
                      label: "Hired",
                      data: jobPositions.map((item) => item.hired_count),
                      backgroundColor: "rgba(0, 96, 96, 0.8)", // darker teal
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
                          size: 9,
                        },
                        maxRotation: 45,
                        minRotation: 45,
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
      </div>
    </div>
  );
};

export default AnalysisPage;