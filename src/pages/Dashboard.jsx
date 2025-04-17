import { act, useEffect, useState } from "react"
import { FiUsers, FiUserCheck, FiCalendar, FiBriefcase, FiRefreshCw } from "react-icons/fi"

import api from "../api/axios"

import PendingApplicantConfirmationModal from "../components/Modals/PendingApplicantConfirmationModal"
import RecentTable from "../components/RecentTable"
import PendingTable from "../components/PendingTable"
import InterviewTable from "../components/InterviewTable"
import { useNavigate } from "react-router-dom"

// Helper function to format dates TO BE REMOVED
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

// Custom Tabs component
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-2 px-1 border-b-2 font-medium body-regular cursor-pointer ${activeTab === tab.value
              ? "border-teal text-teal"
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
  return <div className={`animate-pulse bg-gray-light rounded ${className}`}></div>
}

// Summary Cards Section
const SummarySection = ({ onRefresh, setActiveTab }) => {
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();


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

  const handleCardClick = (tab) => {
    if (tab === "interviews") {
      setActiveTab(tab)
      return;
    }

    navigate("/ats", {
      state: {
        view: tab,
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div
        onClick={() => handleCardClick("listings")}
        className="bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-teal-soft transition duration-200 ease-in-out"
      >
        <div className="p-6 flex flex-col">
          <span className="body-regular text-gray-500">Total Applicants</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 body-regular mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiUsers className="mr-2 h-5 w-5 text-teal" />
              <div className="text-2xl font-bold">{summaryData?.total_applicants.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => handleCardClick("analytics")}
        className="bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-teal-soft transition duration-200 ease-in-out"
      >
        <div className="p-6 flex flex-col">
          <span className="body-regular text-gray-500">Hired</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 body-regular mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiUserCheck className="mr-2 h-5 w-5 text-teal" />
              <div className="text-2xl font-bold">{summaryData?.hired_applicants.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => handleCardClick("interviews")}
        className="bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-teal-soft transition duration-200 ease-in-out"
      >
        <div className="p-6 flex flex-col">
          <span className="body-regular text-gray-500">In Interview Process</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 body-regular mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiCalendar className="mr-2 h-5 w-5 text-teal" />
              <div className="text-2xl font-bold">{summaryData?.in_interview.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => handleCardClick("jobs")}
        className="bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-teal-soft transition duration-200 ease-in-out"
      >
        <div className="p-6 flex flex-col">
          <span className="body-regular text-gray-500">Open Positions</span>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : error ? (
            <div className="text-red-500 body-regular mt-2">Error loading data</div>
          ) : (
            <div className="flex items-center mt-2">
              <FiBriefcase className="mr-2 h-5 w-5 text-teal" />
              <div className="text-2xl font-bold">{summaryData?.open_positions.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
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
        <h3 className="headline text-gray-900">Recent Applicants</h3>
        <p className="body-tiny text-gray-400">Latest applicants in the system</p>
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
        <RecentTable
          applicants={applicants}
          onRowClick={(applicant) => {
            console.log("Clicked applicant:", applicant)
            alert(`Applicant: ${applicant.first_name} ${applicant.last_name}`)
          }}
        />
      )}
    </div>
  )
}

const PendingApplicantsSection = ({ onRefresh }) => {
  const [pendingApplicants, setPendingApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPendingApplicants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/applicants/pending")
      // Update to use the title provided in the API response
      setPendingApplicants(response.data.pendingApplicants.map(item => ({
        applicant_id: item.pending_applicant_id,
        first_name: item.applicant.first_name,
        middle_name: item.applicant.middle_name,
        last_name: item.applicant.last_name,
        email_1: item.applicant.email_1,
        position: item.applicant.title, // Now using the job title directly
        status: item.status === 1 ? "PENDING" : "UNKNOWN",
        applied_date: item.applicant.date_applied
      })))
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

  const handleRowClick = (applicant) => {
    setSelectedApplicant(applicant)
    setIsModalOpen(true)
  }

  const handleActionComplete = (action) => {
    // Refresh the data after action completes
    fetchPendingApplicants()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="headline text-gray-900">Pending Applicants</h3>
        <p className="body-tiny text-gray-400">Applicants awaiting review</p>
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
        <PendingTable
          applicants={pendingApplicants}
          onSelectApplicant={handleRowClick}
        />
      )}

      {/* Confirmation Modal */}
      {
        selectedApplicant && (
          <PendingApplicantConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            applicant={selectedApplicant}
            onActionComplete={handleActionComplete}
          />
        )
      }
    </div >
  )
}

// Interviews Section
const InterviewsSection = ({ onRefresh }) => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchApplicants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/analytics/dashboard/interview-schedule")
      setApplicants(response.data.data)
    } catch (err) {
      console.error("Error fetching interview schedule:", err)
      setError("Failed to load interview schedule")
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
        <h3 className="headline text-gray-900">Upcoming Interviews</h3>
        <p className="body-tiny text-gray-400">Scheduled interviews for the next 7 days</p>
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
        <InterviewTable
          applicants={applicants}
        />

        //   <RecentTable
        //   applicants={applicants}
        //   onRowClick={(applicant) => {
        //     console.log("Clicked applicant:", applicant)
        //     alert(`Applicant: ${applicant.first_name} ${applicant.last_name}`)
        //   }}
        // />
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
    <div>
      <div className=" mx-auto mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Track and analyze your recruitment metrics</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div onClick={handleRefresh} variant="secondary" className="flex items-center gap-2 bg-white text-teal border border-teal hover:bg-[#e6ffff] focus:ring-teal justify-center px-4 py-2 body-regular rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer">
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <SummarySection onRefresh={refreshCounter} setActiveTab={setActiveTab} />

        <div className=" gap-6">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-6 py-3">
              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-4">

                <div className={activeTab === "applicants" ? "block" : "hidden"}>
                  <RecentApplicantsSection onRefresh={refreshCounter} />
                </div>

                <div className={activeTab === "pending" ? "block" : "hidden"}>
                  <PendingApplicantsSection onRefresh={refreshCounter} />
                </div>

                <div className={activeTab === "interviews" ? "block" : "hidden"}>
                  <InterviewsSection onRefresh={refreshCounter} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}