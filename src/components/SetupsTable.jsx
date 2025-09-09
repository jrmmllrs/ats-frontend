import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import Toast from '../assets/Toast';
import setupStore from '../context/setupStore';
import { fetchSetups } from '../services/setupService';
import moment from 'moment';
import AddSetupModal from './Modals/AddSetupModal';

const SetupTable = ({ onSelectApplicant }) => {
    const { setupData, setSetupData } = setupStore();
    const [setupName, setSetupName] = useState("");
    const [setupId, setSetupId] = useState("")
    const [toasts, setToasts] = useState([]);
    const [isEditSetupModalOpen, setIsEditSetupModalOpen] = useState(false);

    const handleJobRowClick = (row) => {
        setSetupName(row.setupName)
        setSetupId(row.setupId)
        setIsEditSetupModalOpen(true);
    };

    const columns = [
        { name: 'Name', selector: row => row.setupName, sortable: true },
        { name: 'Created by', selector: row => row.createdBy, sortable: true },
        { name: 'Date Created', selector: row => moment(row.createdAt).format('LLL'), sortable: true },
    ];

    return (
        <>
            {setupData.length === 0 ? (
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
                    data={setupData}
                    onRowClicked={handleJobRowClick}
                    pagination
                    progressPending={!setupData.length}
                    progressComponent={<LoadingComponent />}
                />
            )}

            {
                isEditSetupModalOpen ? <AddSetupModal onClose={() => setIsEditSetupModalOpen(false)} setupName={setupName} setupId={setupId} /> : null
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

export default SetupTable;
