import React, { useState, useEffect, useCallback } from "react";
import ApplicantDetails from "../components/Applicant/ApplicantDetails";
import ApplicantDiscussionPage from "../components/Applicant/ApplicantDiscussionPage";
import ApplicantSendMailPage from "../components/Applicant/ApplicantSendMailPage";
import api from "../api/axios";
import Loader from "../assets/Loader";

function ApplicantDetailsPage({ applicant }) {
  const [activeTab, setActiveTab] = useState("discussion");
  const [loading, setLoading] = useState(true);
  const [applicantInfo, setApplicantInfo] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create a reusable fetch function
  const fetchApplicantData = useCallback(async () => {
    if (!applicant?.applicant_id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching applicant data for ID:", applicant.applicant_id);
      const response = await api.get(`/applicants/${applicant.applicant_id}`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log("Fetched applicant data:", response.data);
        const processedData = response.data[0] || {};
        setApplicantInfo(processedData);
      } else {
        console.error("No applicant data returned");
        setApplicantInfo({});
      }
    } catch (error) {
      console.error("Error fetching applicant data:", error);
      setApplicantInfo({});
    } finally {
      setLoading(false);
    }
  }, [applicant?.applicant_id]);

  // Fetch data when component mounts or when applicant changes
  useEffect(() => {
    setApplicantInfo({}); // Reset before fetching
    fetchApplicantData();
  }, [applicant, fetchApplicantData, refreshTrigger]);

  // Function to trigger a refresh
  const handleApplicantUpdate = (updatedInfo) => {
    // You can either directly update the state if you have the full object
    if (updatedInfo && Object.keys(updatedInfo).length > 0) {
      setApplicantInfo(updatedInfo);
    } 
    // And also trigger a refresh to ensure latest data from backend
    setRefreshTrigger(prev => prev + 1);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "discussion":
        return <ApplicantDiscussionPage
          applicant={applicantInfo}
        />;
      case "sendMail":
        return <ApplicantSendMailPage applicant={applicantInfo} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // If no applicant is selected or data couldn't be fetched
  if (!applicant || Object.keys(applicantInfo || {}).length === 0) {
    return (
      <div className="border rounded-lg mx-auto text-center p-5">
        <p className="text-gray-500">Select an applicant to view details</p>
      </div>
    );
  }
  
  return (
    <div className="">
      <ApplicantDetails
        applicant={applicantInfo}
        onTabChange={setActiveTab}
        activeTab={activeTab}
        onApplicantUpdate={handleApplicantUpdate}
      />
      <div className="mt-4 mb-10">{renderActiveTab()}</div>
    </div>
  );
}

export default ApplicantDetailsPage;