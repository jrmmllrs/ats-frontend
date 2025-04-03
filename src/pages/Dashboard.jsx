import { useEffect, useState } from "react"
import { FiUsers, FiUserCheck, FiCalendar, FiBriefcase, FiRefreshCw } from "react-icons/fi"

import api from "../api/axios"

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Status badge component
const StatusBadge = ({ status }) => {
  let color = "bg-gray-200 text-gray-800"

  if (status.includes("PASSED") || status.includes("ACCEPTED") || status === "COMPLETED") {
    color = "bg-[#008080] text-white"
  } else if (status.includes("FAILED") || status.includes("REJECTED")) {
    color = "bg-[#004040] text-white"
  } else if (status.includes("SCHEDULED") || status.includes("SENT") || status === "SUBMITTED") {
    color = "bg-[#00a0a0] text-[#004040]"
  } else if (status.includes("PENDING")) {
    color = "bg-[#e6ffff] text-[#006060]"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

// Custom Card component
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

// Custom Card Content component
const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

// Custom Button component
const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-[#008080] text-white hover:bg-[#006060] focus:ring-[#00a0a0]",
    secondary: "bg-white text-[#008080] border border-[#00a0a0] hover:bg-[#e6ffff] focus:ring-[#008080]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Custom Tabs component
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.value
                ? "border-[#008080] text-[#006060]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// Custom Skeleton component
const Skeleton = ({ className = "" }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
}

// Summary Cards Section
const SummarySection = ({ onRefresh }) => {
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummaryData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/analytics/dashboard/summary")
      setSummaryData(response.data.data)
    } catch (err) {
      console.error("Error fetching summary data:", err)
      setError("Failed to load summary data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaryData()
  }, [])

  useEffect(() => {
    if (onRefresh) {
      fetchSummaryData()
    }
  }, [onRefresh])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Total Applicants</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 text-sm mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiUsers className="mr-2 h-5 w-5 text-[#008080]" />
              <div className="text-2xl font-bold">{summaryData?.total_applicants.toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Hired</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 text-sm mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiUserCheck className="mr-2 h-5 w-5 text-[#006060]" />
              <div className="text-2xl font-bold">{summaryData?.hired_applicants.toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">In Interview Process</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 text-sm mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiCalendar className="mr-2 h-5 w-5 text-[#00a0a0]" />
              <div className="text-2xl font-bold">{summaryData?.in_interview.toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Open Positions</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 text-sm mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiBriefcase className="mr-2 h-5 w-5 text-[#004040]" />
              <div className="text-2xl font-bold">{summaryData?.open_positions.toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Recent Applicants Section
const RecentApplicantsSection = ({ onRefresh }) => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchApplicants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/analytics/dashboard/recent-applicants")
      setApplicants(response.data.data)
    } catch (err) {
      console.error("Error fetching recent applicants:", err)
      setError("Failed to load recent applicants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [])

  useEffect(() => {
    if (onRefresh) {
      fetchApplicants()
    }
  }, [onRefresh])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Applicants</h3>
        <p className="text-sm text-gray-500">Latest applicants in the system</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto h-[400px]">
          <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Applied Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <tr key={applicant.applicant_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {`${applicant.first_name} ${applicant.middle_name ? applicant.middle_name + " " : ""}${applicant.last_name}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.email_1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={applicant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(applicant.applied_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent applicants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Pending Applicants Section
const PendingApplicantsSection = ({ onRefresh }) => {
  const [pendingApplicants, setPendingApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPendingApplicants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/analytics/dashboard/pending-applicants")
      setPendingApplicants(response.data.data)
    } catch (err) {
      console.error("Error fetching pending applicants:", err)
      setError("Failed to load pending applicants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingApplicants()
  }, [])

  useEffect(() => {
    if (onRefresh) {
      fetchPendingApplicants()
    }
  }, [onRefresh])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Applicants</h3>
        <p className="text-sm text-gray-500">Applicants awaiting review</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto h-[400px]">
          <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Applied Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApplicants.length > 0 ? (
                pendingApplicants.map((applicant) => (
                  <tr key={applicant.applicant_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {`${applicant.first_name} ${applicant.middle_name ? applicant.middle_name + " " : ""}${applicant.last_name}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.email_1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={applicant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(applicant.applied_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending applicants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Interviews Section
const InterviewsSection = ({ onRefresh }) => {
  const [interviewSchedule, setInterviewSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInterviewSchedule = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/analytics/dashboard/interview-schedule")
      setInterviewSchedule(response.data.data)
    } catch (err) {
      console.error("Error fetching interview schedule:", err)
      setError("Failed to load interview schedule")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviewSchedule()
  }, [])

  useEffect(() => {
    if (onRefresh) {
      fetchInterviewSchedule()
    }
  }, [onRefresh])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
        <p className="text-sm text-gray-500">Scheduled interviews for the next 7 days</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto h-[400px]">
          <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Interview Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Interviewer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interviewSchedule.length > 0 ? (
                interviewSchedule.map((interview) => (
                  <tr key={interview.interview_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {`${interview.first_name} ${interview.middle_name ? interview.middle_name + " " : ""}${interview.last_name}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(interview.date_of_interview)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.interviewer_name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No upcoming interviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  // State for tracking refresh trigger
  const [refreshCounter, setRefreshCounter] = useState(0)
  
  // Active tab
  const [activeTab, setActiveTab] = useState("applicants")

  // Tabs configuration
  const tabs = [
    { label: "Recent Applicants", value: "applicants" },
    { label: "Pending Applicants", value: "pending" },
    { label: "Upcoming Interviews", value: "interviews" },
  ]

  // Handle refresh action
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1)
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
            <p className="text-gray-500">Track and analyze your recruitment metrics</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button onClick={handleRefresh} variant="secondary" className="flex items-center gap-2">
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummarySection onRefresh={refreshCounter} />

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardContent className="p-0">
              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-6">
                {/* Fixed content container with consistent height to prevent layout shift */}
                <div className="min-h-[500px]">
                  {/* Applicants Tab Content */}
                  <div className={activeTab === "applicants" ? "block" : "hidden"}>
                    <RecentApplicantsSection onRefresh={refreshCounter} />
                  </div>

                  {/* Pending Applicants Tab Content */}
                  <div className={activeTab === "pending" ? "block" : "hidden"}>
                    <PendingApplicantsSection onRefresh={refreshCounter} />
                  </div>

                  {/* Interviews Tab Content */}
                  <div className={activeTab === "interviews" ? "block" : "hidden"}>
                    <InterviewsSection onRefresh={refreshCounter} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}