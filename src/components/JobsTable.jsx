import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';
import jobStore from '../context/jobListingStore';
import { fetchJobs } from '../utils/jobListing';

const JobsTable = ({ onSelectApplicant }) => {
    const { jobsData, setJobsData } = jobStore();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const getJobsData = async () => {
            await fetchJobs(setJobsData);
        }    
        getJobsData();
    }, [])

    const handleJobRowClick = (row) => {
        alert("clicked");
    };

    const columns = [
        { name: 'Title', selector: row => row.jobTitle, sortable: true },
        { name: 'Industry', selector: row => row.industryName, sortable: true },
        { name: 'Employment Type', selector: row => row.employmentType, sortable: true },
        { name: 'Status', selector: row => row.isOpen == "1" ? "Open" : "Closed", sortable: true },
        { name: 'Setup', selector: row => row.setupName, sortable: true },
        { name: 'Visibility', selector: row => row.isShown == "1" ? "Shown" : "Hidden", sortable: true }
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
                    fixedHeaderScrollHeight="60vh"
                    responsive
                    columns={columns}
                    data={jobsData}
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
