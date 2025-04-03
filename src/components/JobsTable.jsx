import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';

const JobsTable = ({ onSelectApplicant }) => {
    const [jobsData, setJobsData] = useState([
        {
            title: "Finance Operations Manager",
            industry: "Finance Operations",
            employmentType: "Full-time",
            status: "Closed",
            setup: "Officed-based",
            visibility: "show"
        },
        {
            title: "Finance Operations Associate Manager",
            industry: "Finance Operations",
            employmentType: "Full-time",
            status: "Open",
            setup: "Officed-based",
            visibility: "hide"
        },
    ]);
    const [toasts, setToasts] = useState([]);

    const handleJobRowClick = (row) => {
        alert("clicked");
    };

    const columns = [
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Industry', selector: row => row.industry, sortable: true },
        { name: 'Employment Type', selector: row => row.employmentType, sortable: true },
        { name: 'Status', selector: row => row.status, sortable: true },
        { name: 'Setup', selector: row => row.setup, sortable: true },
        { name: 'Visibility', selector: row => row.visibility == "show" ? "Shown" : "Hidden", sortable: true }
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
