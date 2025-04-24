import { useState, useEffect } from "react";
import api from "../../api/axios.js"; // Import the axios instance

export default function ATSHealthcheck({ onSelectApplicant }) {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    general: [],
    needsAttention: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true); // New state to control notification visibility

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notification");
        const data = response.data;
        console.log(data);
        if (!data) {
          throw new Error("No data received from server");
        }

        // Format ATS notifications
        const generalNotifications = [];
        const needsAttentionNotifications = [];

        // Process ATS applicants
        if (data.ats && Array.isArray(data.ats)) {
          data.ats.forEach(applicant => {
            const notificationItem = {
              id: applicant.applicant_id,
              name: `${applicant.first_name} ${applicant.last_name}`,
              position: applicant.title,
              timeAgo: getTimeAgo(applicant.date_created),
              applicantData: applicant,
              status: getFormattedStatus(applicant.status, applicant.stage),
            };

            needsAttentionNotifications.push({
              ...notificationItem,
            });
          });
        }

        if (data.general && Array.isArray(data.general)) {
          data.general.forEach(applicant => {
            const notificationItem = {
              id: applicant.applicant_id,
              name: `${applicant.first_name} ${applicant.last_name}`,
              position: applicant.title,
              timeAgo: getTimeAgo(applicant.date_created),
              applicantData: applicant,
              status: getFormattedStatus(applicant.status, applicant.stage),
            };

            generalNotifications.push({
              ...notificationItem,
            });
          });
        }

        setNotifications({
          general: generalNotifications,
          needsAttention: needsAttentionNotifications
        });
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Helper function to get time ago text from date
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // Helper function to format status display
  const getFormattedStatus = (status, stage) => {
    if (status === "FIRST_INTERVIEW") return "First Interview Stage";
    if (status === "SECOND_INTERVIEW") return "Second Interview Stage";
    if (status === "THIRD_INTERVIEW") return "Third Interview Stage";
    if (status === "FOURTH_INTERVIEW") return "Fourth Interview Stage";
    if (status === "FOLLOW_UP_INTERVIEW") return "Follow-up Interview Stage";
    if (status === "FOR_JOB_OFFER" || status === "JOB_OFFER_ACCEPTED" ||
      status === "JOB_OFFER_REJECTED") return "Job Offer";
    if (status === "TEST_SENT") return "Test Sent";

    // Fallback to stage if status not recognized
    if (stage === "JOB_OFFER") return "Job Offer";
    if (stage === "INTERVIEW_SCHEDULE") return "Interview Scheduled";

    return status.replace(/_/g, " ");
  };

  const handleApplicantClick = async (applicant) => {
    try {
      const response = await api.delete(`/notification/remove/${applicant.applicant_id}`);
      if (response.status === 200) {
        onSelectApplicant(applicant);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  };

  // If not open, return null to hide the component
  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex items-center justify-center body-regular text-gray-dark">
      <div className="rounded-lg w-full max-w-md overflow-hidden relative">
        <div className="">
          <h2 className="headline">Notification</h2>
          <div className="flex border-b border-gray-200 mt-3">
            <button
              className={`p-1 px-4 hover:bg-gray-light/50 cursor-pointer ${activeTab === "general" ? "text-teal border-b border-tealfont-medium" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`p-1 px-4 hover:bg-gray-light/50 cursor-pointer ${activeTab === "needsAttention"
                ? "text-teal border-b border-teal font-medium"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab("needsAttention")}
            >
              Needs Attention
            </button>
          </div>
        </div>


        <div className="max-h-[500px] overflow-y-auto p-2">

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading notifications...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <>
              {activeTab === "general" && notifications.general.length === 0 && (
                <div className="p-4 text-center text-gray-500">No general notifications</div>
              )}

              {activeTab === "general" &&
                notifications.general.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-xl mb-3 cursor-pointer hover:bg-gray-light/50"
                    onClick={() => handleApplicantClick(notification.applicantData)}
                  >
                    <div className="flex items-center">
                      <div>
                        <div className="body-bold">{notification.name}</div>
                        <div className="text-gray-dark/50 body-tiny">{notification.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`body-bold`}>{notification.status}</div>
                      <div className={`text-teal body-tiny`}>Applied {notification.timeAgo}</div>
                    </div>
                  </div>
                ))}

              {activeTab === "needsAttention" && notifications.needsAttention.length === 0 && (
                <div className="p-4 text-center text-gray-500">No items need attention</div>
              )}

              {activeTab === "needsAttention" &&
                notifications.needsAttention.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-xl mb-3 cursor-pointer hover:bg-gray-light/50"
                    onClick={() => handleApplicantClick(notification.applicantData)}
                  >
                    <div className="flex items-center">
                      <div>
                        <div className="body-bold">{notification.name}</div>
                        <div className="text-gray-dark/50 body-tiny">{notification.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`body-bold`}>{notification.status}</div>
                      <div className={`text-teal body-tiny`}>{notification.timeAgo}</div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}