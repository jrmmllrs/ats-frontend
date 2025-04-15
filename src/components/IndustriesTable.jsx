
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';
import industriesStore from '../context/industriesStore';
import { fetchIndustries } from '../utils/industriesUtils';
import moment from 'moment';
import AddIndustryModal from './Modals/AddIndustryModal';

const IndustriesTable = ({ onSelectApplicant }) => {
    const { industries, setIndustries } = industriesStore();
    const [industry, setIndustry] = useState({});
    const [isEditIndustryModalOpen, setIsEditIndustryModalOpen] = useState(false);
    const [toasts, setToasts] = useState([]);

    const handleJobRowClick = (row) => {
        console.log(row);
        setIndustry(row);
        setIsEditIndustryModalOpen(true);
    };

    const columns = [
        { name: 'Industry Name', selector: row => row.industryName, sortable: true },
        { name: 'Assessment Url', selector: row => row.assessmentUrl, sortable: true },
        { name: 'Created By', selector: row => row.createdBy, sortable: true },
        { name: 'Date Created', selector: row => moment(row.createdAt).format('LLL'), sortable: true },
    ];

    return (
        <>
            {industries.length === 0 ? (
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
                    data={industries}
                    onRowClicked={handleJobRowClick}
                    pagination
                    progressPending={!industries.length}
                    progressComponent={<LoadingComponent />}
                />
            )}

            {
                isEditIndustryModalOpen ? <AddIndustryModal onClose={() => setIsEditIndustryModalOpen(false)} industry={industry}/> : ""
            }

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

export default IndustriesTable;
