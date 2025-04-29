import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import useTabs from "../hooks/useTabs";
import api from "../api/axios";

import ApplicantList from "../layouts/ApplicantList";
import ApplicantDetail from "./ApplicantDetailsPage";
import StatusCounter from "../layouts/StatusCounter";
import AddApplicantForm from "./AddApplicantForm";
import ConfirmationModal from "../components/Modals/ConfirmationModal"; // Import the modal

export default function ApplicantListView() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for modal visibility
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        tabs,
        activeTab,
        setActiveTab,
        addTab,
        closeTab,
        closeAll,
        showWarning,
        setShowWarning
    } = useTabs();

    useEffect(() => {
        if (id) {
            setActiveTab(id);

            if (!tabs.find((tab) => tab.id === id)) {
                api.get(`/applicants/${id}`)
                    .then(res => {
                        const applicant = res.data?.[0];
                        if (applicant) addTab(applicant);
                    })
                    .catch(err => console.error("Error fetching applicant:", err));
            }
        } else {
            setActiveTab(null);
        }
    }, [id]);

    const handleSelectApplicant = (applicant) => {
        addTab(applicant);
        navigate(`/applicants/${applicant.applicant_id}`);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        navigate(`/applicants/${tabId}`);
    };

    const handleCloseTab = (tabId) => {
        if (activeTab === tabId) {
            navigate("/applicants");
        }
        closeTab(tabId);
    };

    const handleClearAllTabs = () => {
        setShowConfirmationModal(true); // Show the confirmation modal
    };

    const confirmClearAllTabs = () => {
        closeAll();
        navigate("/applicants");
        setShowConfirmationModal(false); // Close the modal
    };

    if (showAddForm) return <AddApplicantForm onClose={() => setShowAddForm(false)} />;

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="mb-4 flex flex-wrap items-center rounded-lg border border-gray-light bg-white p-1 pb-0">
                <button
                    className={`px-3 py-1 mb-1 mr-2 rounded-md border body-bold ${activeTab === null ? "bg-teal-soft text-teal" : "bg-white text-teal hover:bg-gray-light"}`}
                    onClick={() => {
                        setActiveTab(null);
                        navigate("/applicants");
                    }}
                >
                    Applicant List
                </button>

                <div className="flex flex-1 flex-wrap space-x-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`flex items-center px-2 py-1 mb-1 rounded-md ${activeTab === tab.id ? "bg-teal-soft text-teal" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        >
                            <button
                                className="truncate max-w-[100px] body-regular cursor-pointer"
                                onClick={() => handleTabClick(tab.id)}
                                title={tab.name}
                            >
                                {tab.name.length > 10 ? `${tab.name.slice(0, 10)}...` : tab.name}
                            </button>
                            <button
                                className="ml-1 text-gray-600 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent tab activation
                                    handleCloseTab(tab.id);
                                }}
                            >
                                <FaTimes className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {tabs.length > 0 && (
                    <div
                        className="px-3 py-1 mb-1 ml-2 text-gray-light hover:text-gray-dark cursor-pointer"
                        onClick={handleClearAllTabs} // Use the modal trigger
                    >
                        Clear
                    </div>
                )}
            </div>

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Warning</h3>
                        <p>You can only open up to 10 tabs.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-teal text-white rounded hover:bg-teal-dark"
                                onClick={() => setShowWarning(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <ConfirmationModal
                    title="Clear All Tabs"
                    message="Are you sure you want to close all tabs?"
                    confirmText="Yes"
                    cancelText="No"
                    onConfirm={confirmClearAllTabs} // Confirm action
                    onCancel={() => setShowConfirmationModal(false)} // Cancel action
                />
            )}

            {/* Main View */}
            {activeTab === null ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <ApplicantList
                            onSelectApplicant={handleSelectApplicant}
                            onAddApplicantClick={() => setShowAddForm(true)}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <StatusCounter />
                    </div>
                </div>
            ) : (
                <ApplicantDetail
                    applicantId={activeTab}
                    applicantData={tabs.find(tab => tab.id === activeTab)?.data}
                />
            )}
        </div>
    );
}