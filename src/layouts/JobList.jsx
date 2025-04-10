import { useEffect, useState } from "react";
import JobsTable from "../components/JobsTable";
import { FaGear, FaPlus } from "react-icons/fa6";
import IndustriesModal from "../components/Modals/IndustriesModal";
import { set } from "date-fns";
import { addJob, fetchCloseJobsCount, fetchOpenJobsCount, fetchJobs, searchJobs } from "../utils/jobListing";
import jobStore from "../context/jobListingStore";
import setupStore from "../context/setupStore";
import industriesStore from "../context/industriesStore";
import useUserStore from "../context/userStore";
import JobCountStore from "../context/jobsCountStore";

const JobList = () => {
    const { setOpenJobsCount, setCloseJobsCount } = JobCountStore();
    const { user } = useUserStore();
    const [searchVal, setSearchVal] = useState("");
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
    const { industries, setIndustries } = industriesStore();
    const [jobData, setJobData] = useState({
        title: "",
        industryId: "",
        description: "",
        minSalary: "",
        maxSalary: "",
        employmentType: "Full-time",
        setup: "",
        responsibilities: "",
        requirements: "",
        preferredQualifications: "",
        isOpen: "1",
        isShown: "1",
        userId: user.user_id,
    });
    const { setupData, setSetupData } = setupStore();
    const { jobsData, setJobsData, isGearModalOpen, setIsGearModalOpen } = jobStore();

    useEffect(() => {
        if (industries.length > 0) {
            setJobData((prevJobData) => ({
                ...prevJobData,
                industryId: industries[0].industryId,
            }));
        }
    }, [industries]);

    useEffect(() => {
        if (setupData.length > 0) {
            setJobData((prevJobData) => ({
                ...prevJobData,
                setupId: setupData[0].setupId,
            }));
        }
    }, [industries]);

    const handleChange = (e) => {  
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addJob(jobData);
        await fetchJobs(setJobsData);
        await fetchCloseJobsCount(setCloseJobsCount)
        await fetchOpenJobsCount(setOpenJobsCount);
        console.log("Job Data Submitted:", jobData);
        setIsAddJobModalOpen(false);
    };

    return (
        <div className="rounded-3xl bg-white mx-10 p-6 pb-1 border border-gray-light">
            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <h1 className="headline font-semibold text-gray-dark">Job List</h1>

                <div className="flex space-x-4 items-center">
                    <button
                        onClick={() => setIsAddJobModalOpen(true)}
                        className="rounded-md flex gap-2 body-regular text-center items-center px-3 bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                    >
                        <FaPlus className="size-3" />
                        Job
                    </button>
                    <button
                        onClick={() => setIsGearModalOpen(true)}
                        className="rounded-md bg-white text-teal hover:text-teal/70 cursor-pointer"
                    >
                        <FaGear className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Search Filter Section */}
            <div className="mb-4 flex flex-wrap items-center gap-2 bg-teal-600/10 p-2 rounded-lg">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full sm:w-1/2 md:w-1/4 p-2 body-regular focus:outline-teal border border-gray-300 rounded-md"
                    onChange={(e) => {setSearchVal(e.target.value); searchJobs(e.target.value, setJobsData);
                    }}
                />
            </div>

            {/* Jobs Table Section */}
            <div className="rounded-lg bg-white overflow-hidden">
                <JobsTable />
            </div>

            {/* Add Job Modal */}
            {isAddJobModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg text-gray-dark border border-gray-light w-full max-w-[50vw] ml-70">
                        <h2 className="headline mb-4">Add Job</h2>

                        <form onSubmit={handleSubmit} className="space-y-4 body-regular">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Job Title */}
                                <div>
                                    <label className="block">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={jobData.title}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                        required
                                    />
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="block">Industry</label>
                                    <select 
                                    name="industryId" 
                                    value={jobData.industryId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        {industries.map((industry, index) => (
                                            <option key={index} value={industry.industryId}>{industry.industryName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block">Description</label>
                                <textarea
                                    name="description"
                                    value={jobData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Min and Max Salary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block">Min Salary</label>
                                    <input
                                        type="number"
                                        name="minSalary"
                                        value={jobData.minSalary}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block">Max Salary</label>
                                    <input
                                        type="number"
                                        name="maxSalary"
                                        value={jobData.maxSalary}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                {/* Employment Type */}
                                <div>
                                    <label className="block">Employment Type</label>
                                    <select
                                        name="employmentType"
                                        value={jobData.employmentType}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>

                                {/* Setup */}
                                <div>
                                    <label className="block">Setup</label>
                                    <select
                                        name="setupId"
                                        value={jobData.setupId}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        {setupData.map((setup, index) => (
                                            <option key={index} value={setup.setupId}>{setup.setupName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <label className="block">Responsibilities</label>
                                <textarea
                                    name="responsibilities"
                                    value={jobData.responsibilities}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block">Requirements</label>
                                <textarea
                                    name="requirements"
                                    value={jobData.requirements}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Preferred Qualifications */}
                            <div>
                                <label className="block">Preferred Qualifications</label>
                                <textarea
                                    name="preferredQualifications"
                                    value={jobData.preferredQualifications}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">

                                {/* Status */}
                                <div>
                                    <label className="block">Status</label>
                                    <select
                                        name="isOpen"
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="1">Open</option>
                                        <option value="0">Closed</option>
                                    </select>
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block">Visibility</label>
                                    <select
                                        name="isShown"
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="1">Shown</option>
                                        <option value="0">Hidden</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddJobModalOpen(false)}
                                    className="px-4 py-2 bg-white border border-teal text-teal rounded-md cursor-pointer hover:bg-teal/20"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-teal text-white rounded-md cursor-pointer hover:bg-teal/70">
                                    Save Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gear Modal */}
            {isGearModalOpen && <IndustriesModal onClose={() => setIsGearModalOpen(false)} />}
        </div>
    );
};

export default JobList;
