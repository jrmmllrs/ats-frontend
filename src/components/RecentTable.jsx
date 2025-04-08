import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';

const RecentTable = ({ applicants, onSelectApplicant }) => {
    const [recentApplicants, setApplicants] = useState(applicants || []);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        setApplicants(applicants || []);
    }, [applicants]);

    const handleJobRowClick = (row) => {
        alert(`Clicked on: ${row.first_name} ${row.last_name}`);
        console.log("Clicked row:", row);
        if (onSelectApplicant) onSelectApplicant(row); // optional callback
    };

    const columns = [
        { name: 'Name', selector: row => `${row.first_name} ${row.last_name}` },
        { name: 'Email', selector: row => row.email_1 },
        { name: 'Position', selector: row => row.position },
        { name: 'Status', selector: row => row.status },
        { name: 'Applied Date', selector: row => row.applied_date },
    ];

    return (
        <>
            {recentApplicants.length === 0 ? (
                <div className="text-center text-lg font-semibold text-gray-600 mt-8">
                    No recent applicants found.
                </div>
            ) : (
                <DataTable
                    pointerOnHover
                    highlightOnHover
                    fixedHeader
                    fixedHeaderScrollHeight="45vh"
                    responsive
                    columns={columns}
                    data={recentApplicants}
                    progressPending={!recentApplicants.length}
                    onRowClicked={handleJobRowClick}
                    progressComponent={<LoadingComponent />}
                />
            )}

            {/* Toasts if needed */}
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

export default RecentTable;
