import JobList from "../layouts/JobList";
import JobCountStore from "../context/jobsCountStore";
import { useEffect, useState } from "react";
import { fetchCloseJobsCount, fetchIndustriesCount, fetchJobs, fetchOpenJobsCount, getCloseJobs, getOpenJobs } from "../utils/jobListing";
import jobStore from "../context/jobListingStore";


const Jobs = () => {
    const { industriesCount, setIndustriesCount, openJobsCount, setOpenJobsCount, closeJobsCount, setCloseJobsCount } = JobCountStore();
    const { setIsGearModalOpen, setJobsData } = jobStore();
    const [activeTab, setActiveTab] = useState();

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
            await fetchIndustriesCount(setIndustriesCount);
            await fetchOpenJobsCount(setOpenJobsCount);
            await fetchCloseJobsCount(setCloseJobsCount);
        }
        getCounts();
    }, [])

    return (
        <div className="flex-col items-center justify-center mx-20">
            <section className="m-10 grid grid-cols-3 grid-rows-[7rem] gap-10">
                {/* <div
                    onClick={() => alert("applicants")}
                    className="rounded-md grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center ">147</span>
                    <div className="text-sm text-gray-500 text-center">Applications</div>
                </div> */}
                <div
                    onClick={() => setIsGearModalOpen(true)}      //nyenyenyenyenyenye
                    className="rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center">{industriesCount}</span>
                    <div className="text-sm text-gray-500 text-center">Industries</div>
                </div>
                <div
                    onClick={() => handleTabClick("open")}
                    className={`rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light ${activeTab === "open" ? "border-teal-soft border-2" : ""}`}
                >
                    <span className="text-3xl text-center">{openJobsCount}</span>
                    <div className="text-sm text-gray-500 text-center">Open Jobs</div>
                </div>
                <div
                    onClick={() => handleTabClick("close")}
                    className={`rounded-2xl grid place-content-center cursor-pointer bg-white border border-gray-light ${activeTab === "close" ? "border-teal-soft border-2" : ""}`}
                >
                    <span className="text-3xl text-center">{closeJobsCount}</span>
                    <div className="text-sm text-gray-500 text-center">Closed Jobs</div>
                </div>
            </section>
            <JobList />
        </div>
    );
};


export default Jobs;
