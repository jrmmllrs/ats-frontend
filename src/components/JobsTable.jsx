import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';
import jobStore from '../context/jobListingStore';
import { fetchJobs, updateJob, fetchCloseJobsCount, fetchOpenJobsCount, getOpenJobs, getCloseJobs } from '../utils/jobListing';
import JobCountStore from '../context/jobsCountStore';
import setupStore from '../context/setupStore';
import industriesStore from '../context/industriesStore';
import { fetchSetups } from '../utils/setupUtils';
import { fetchIndustries } from '../utils/industriesUtils';

const JobsTable = ({ onSelectApplicant }) => {
    const { jobsData, setJobsData, activeTab, setActiveTab } = jobStore();
    const [toasts, setToasts] = useState([]);
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
    const { setOpenJobsCount, setCloseJobsCount } = JobCountStore();
    const [jobData, setJobData] = useState({});
    const { setupData, setSetupData } = setupStore();
    const { industries, setIndustries } = industriesStore();

    useEffect(() => {
        const getJobsData = async () => {
            await fetchJobs(setJobsData);
            await fetchSetups(setSetupData);
            await fetchIndustries(setIndustries);
        }
        getJobsData();
    }, [])

    const handleJobRowClick = (row) => {
        setJobData(row)
        setIsAddJobModalOpen(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateJob(jobData);
            if (activeTab === "open") {
                getOpenJobs(setJobsData);
            } else if (activeTab === "close") {
                getCloseJobs(setJobsData);
            } else {
                fetchJobs(setJobsData);
            }
            await fetchCloseJobsCount(setCloseJobsCount);
            await fetchOpenJobsCount(setOpenJobsCount);
            setIsAddJobModalOpen(false);
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };


    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };


    const columns = [
        { name: 'Title', selector: row => row.jobTitle, sortable: true },
        { name: 'Industry', selector: row => row.industryName, sortable: true },
        { name: 'Employment Type', selector: row => row.employmentType, sortable: true },
        { name: 'Status', selector: row => row.isOpen == "1" ? "Open" : "Closed", sortable: true },
        { name: 'Setup', selector: row => row.setupName, sortable: true },
        // { name: 'Visibility', selector: row => row.isShown == "1" ? "Shown" : "Hidden", sortable: true }
    ];

    return (
        <>
            {jobsData.length === 0 ? (
                <div className="text-center text-lg font-semibold text-gray-600 mt-8">
                    No jobs found.
                </div>
            ) : (
                <DataTable
                    pointerOnHover
                    highlightOnHover
                    fixedHeaderScrollHeight="50vh"
                    responsive
                    columns={columns}
                    // data={jobsData}
                    data={jobsData.filter(job => job.isShown == "1")}
                    onRowClicked={handleJobRowClick}
                    pagination
                    progressPending={!jobsData.length}
                    progressComponent={<LoadingComponent />}
                />
            )}

            {/* <div className="fixed top-4 right-4 space-y-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        removeToast={() => setToasts(toasts.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div> */}

            {/* Edit Job Modal */}
            {isAddJobModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg text-gray-dark border border-gray-light w-full max-w-[50vw] ml-70">
                        <h2 className="headline mb-4">Edit Job</h2>

                        <form onSubmit={handleSubmit} className="space-y-4 body-regular">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Job Title */}
                                <div>
                                    <label className="block">Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={jobData.jobTitle}
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
                                        name="salaryMin"
                                        value={jobData.salaryMin}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-light rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block">Max Salary</label>
                                    <input
                                        type="number"
                                        name="salaryMax"
                                        value={jobData.salaryMax}
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
                                    name="responsibility"
                                    value={jobData.responsibility}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block">Requirements</label>
                                <textarea
                                    name="requirement"
                                    value={jobData.requirement}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-light rounded-md"
                                    required
                                ></textarea>
                            </div>

                            {/* Preferred Qualifications */}
                            <div>
                                <label className="block">Preferred Qualifications</label>
                                <textarea
                                    name="preferredQualification"
                                    value={jobData.preferredQualification}
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
                                        value={jobData.isOpen}
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
                                        value={jobData.isShown}
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
                                    Edit Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

function LoadingComponent() {
    return (
        <div className="flex flex-col w-full space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-sm bg-gray-light"></div>
            ))}
        </div>
    );
}

export default JobsTable;
