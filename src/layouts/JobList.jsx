import { useState } from "react";
import JobsTable from "../components/JobsTable";
import { FaGear, FaPlus } from "react-icons/fa6";
import IndustriesModal from "../components/Modals/IndustriesModal";
import { set } from "date-fns";
import { searchJobs } from "../utils/jobListing";
import jobStore from "../context/jobListingStore";

const JobList = () => {
    const [searchVal, setSearchVal] = useState("");
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
    const [isGearModalOpen, setIsGearModalOpen] = useState(false);
    const [jobData, setJobData] = useState({
        title: "",
        industry: "",
        description: "",
        minSalary: "",
        maxSalary: "",
        employmentType: "Full-time",
        setup: "On-site",
        responsibilities: "",
        requirements: "",
        preferredQualifications: "",
        status: "Open",
        visibility: "Public",
    });
    const { jobsData, setJobsData } = jobStore();

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                    <input
                                        type="text"
                                        name="industry"
                                        value={jobData.industry}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                        required
                                    />
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
                                        name="setup"
                                        value={jobData.setup}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
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
                                        name="status"
                                        value={jobData.status}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block">Visibility</label>
                                    <select
                                        name="visibility"
                                        value={jobData.visibility}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                    >
                                        <option value="show">Shown</option>
                                        <option value="hide">Hidden</option>
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
