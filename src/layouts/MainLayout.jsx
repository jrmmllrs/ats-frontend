import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import ATSHealthcheck from "../components/Modals/ATSHeathcheck.jsx";
import useUserStore from "../context/userStore.jsx";
import api from "../services/api";
import Cookies from "js-cookie";

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showATSHealthcheck, setShowATSHealthcheck] = useState(false);
    const atsModalRef = useRef(null);

    const setUser = useUserStore((state) => state.setUser);

    // Get the current view from URL path
    const currentView = location.pathname.split("/")[1] || "dashboard";

    // Handle click outside of ATS healthcheck modal
    useEffect(() => {
        function handleClickOutside(event) {
            if (atsModalRef.current && !atsModalRef.current.contains(event.target)) {
                setShowATSHealthcheck(false);
            }
        }

        if (showATSHealthcheck) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showATSHealthcheck]);

    // Fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = Cookies.get("token");
                const response = await api.get("/user/getuserinfo", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserInfo();
    }, [setUser]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const toggleATSHealthcheck = () => setShowATSHealthcheck(!showATSHealthcheck);

    // Function to handle applicant selection (for ATS Healthcheck)
    const selectApplicant = (applicant) => {
        setShowATSHealthcheck(false);
        navigate(`/applicants/${applicant.applicant_id}`);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 px-5 sm:flex-row">
            {/* Sidebar */}
            <div
                className={`fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleSidebarCollapse}
                    selectedView={currentView}
                />
            </div>

            {/* Main Content */}
            <div className={`flex flex-col w-full transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "md:ml-20" : "md:ml-72"
            } lg:px-5`}>
                {/* Only show header if not on dashboard */}
                {currentView !== "dashboard" && (
                    <Header
                        onToggleSidebar={toggleSidebar}
                        onToggleATSHealthcheck={toggleATSHealthcheck}
                        selectedView={currentView}
                    />
                )}

                {/* Main Content Section */}
                <main className="flex-1 overflow-auto rounded-lg">
                    <Outlet />
                </main>
            </div>

            {/* ATS Healthcheck Modal */}
            {showATSHealthcheck && (
                <div className="fixed inset-0 flex items-start justify-end z-10 mx-10 mt-15">
                    <div
                        ref={atsModalRef}
                        className="bg-white rounded-3xl py-5 border border-gray-light shadow-xl w-full max-w-lg relative pointer-events-auto"
                    >
                        <ATSHealthcheck onSelectApplicant={selectApplicant} />
                    </div>
                </div>
            )}
        </div>
    );
}