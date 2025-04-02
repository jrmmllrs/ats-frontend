import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';

const SetupTable = ({ onSelectApplicant }) => {
    const [jobsData, setJobsData] = useState([
        {
            name: "Hybrid",
            created_by: "HR Tester",
            date_created: "Kahapon",
        },
        {
            name: "On-Stie",
            created_by: "HR Tester",
            date_created: "Kahapon",
        },
        {
            name: "Office-Based",
            created_by: "HR Tester",
            date_created: "Kahapon",
        },
        {
            name: "Remote",
            created_by: "HR Tester",
            date_created: "Kahapon",
        },
    ]);
    const [toasts, setToasts] = useState([]);

    const handleJobRowClick = (row) => {
        alert("clicked");
    };

    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Created by', selector: row => row.created_by, sortable: true },
        { name: 'Date Created', selector: row => row.date_created, sortable: true },
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

export default SetupTable;
