import JobList from "../layouts/JobList";
import JobCountStore from "../context/jobsCountStore";
import { useEffect, useState } from "react";
import { fetchCloseJobsCount, fetchIndustriesCount, fetchJobs, fetchOpenJobsCount, getCloseJobs, getOpenJobs } from "../utils/jobListing";
import jobStore from "../context/jobListingStore";
import Loader from "../assets/Loader";



const Jobs = () => {
    const { industriesCount, setIndustriesCount, openJobsCount, setOpenJobsCount, closeJobsCount, setCloseJobsCount } = JobCountStore();
    const { setIsGearModalOpen, setJobsData, activeTab, setActiveTab } = jobStore();
    const [loading, setLoading] = useState(true);

    const handleTabClick = (tab) => {
        if (tab === "open" && activeTab !== "open") {
            setActiveTab("open");
            getOpenJobs(setJobsData);
        } else if (tab === "close" && activeTab !== "close") {
            setActiveTab("close");
            getCloseJobs(setJobsData);
        } else {
            setActiveTab(null);
            fetchJobs(setJobsData);
        }
    }

    useEffect(() => {
        const getCounts = async () => {
            try {
                await Promise.all([
                    fetchIndustriesCount(setIndustriesCount),
                    fetchOpenJobsCount(setOpenJobsCount),
                    fetchCloseJobsCount(setCloseJobsCount),
                ]);
            } finally {
                setLoading(false);
            }
        };
        getCounts();
    }, []);

    return (
        <div className="flex-col items-center justify-center">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader
                        type="spinner"
                        size="xl"
                        color="#008080"
                        text="Loading jobs..."
                        fullScreen={false}
                        className="mx-auto"
                        theme="teal"
                    />
                </div>
            ) : (
                <>
                    <section className="mb-5 grid grid-cols-3 grid-rows-[7rem] gap-5">
                        <div
                            onClick={() => setIsGearModalOpen(true)}
                            className="rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light hover:bg-teal-soft transition duration-300 ease-in-out"
                        >
                            <span className="text-3xl text-center">{industriesCount}</span>
                            <div className="text-sm text-gray-500 text-center">Industries</div>
                        </div>
                        <div
                            onClick={() => handleTabClick("open")}
                            className={`rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light ${activeTab === "open" ? "border-teal-soft border-2" : ""} hover:bg-teal-soft transition duration-300 ease-in-out`}
                        >
                            <span className="text-3xl text-center">{openJobsCount}</span>
                            <div className="text-sm text-gray-500 text-center">Open Jobs</div>
                        </div>
                        <div
                            onClick={() => handleTabClick("close")}
                            className={`rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light ${activeTab === "close" ? "border-teal-soft border-2" : ""} hover:bg-teal-soft transition duration-300 ease-in-out`}
                        >
                            <span className="text-3xl text-center">{closeJobsCount}</span>
                            <div className="text-sm text-gray-500 text-center">Closed Jobs</div>
                        </div>
                    </section>
                    <JobList />
                </>
            )}
        </div>

    );




};


export default Jobs;
