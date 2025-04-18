import { FaTimes } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import SetupTable from "../SetupsTable";
import { useState } from "react";
import IndustriesTable from "../IndustriesTable";
import AddIndustryModal from "./AddIndustryModal";
import AddSetupModal from "./AddSetupModal";

const IndustriesModal = ({ onClose }) => {
    const [isActive, setIsActive] = useState('industry');
    const [isAddIndustryModalOpen, setIsAddIndustryModalOpen] = useState(false);
    const [isAddSetupModalOpen, setIsAddSetupModalOpen] = useState(false);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
            <div className="rounded-3xl bg-white mx-10 p-6 pb-1 border border-gray-light w-200">
                {/* Header Section */}
                <div className="flex items-center justify-between gap-2 pb-1 border-b-2 border-gray-light">
                    <div className="flex gap-2">
                        <h1
                            onClick={() => setIsActive('industry')}
                            className={`headline font-normal text-gray-dark cursor-pointer hover:bg-gray-light rounded-md px-1 ${isActive === 'industry' ? "bg-teal-soft text-teal font-bold" : ""}`}
                        >
                            Industries
                        </h1>
                        <h1
                            onClick={() => setIsActive('setup')}
                            className={`headline font-normal text-gray-dark cursor-pointer hover:bg-gray-light rounded-md px-1 ${isActive === 'setup' ? "bg-teal-soft text-teal font-bold" : ""}`}
                        >
                            Setup
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        {
                            isActive == 'industry' ?
                                <button
                                    onClick={() => setIsAddIndustryModalOpen(true)}
                                    className="rounded-md flex gap-2 body-regular text-center items-center px-3 bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                                >
                                    <FaPlus className="size-3" />
                                    Industry
                                </button>
                                :
                                <button
                                    onClick={() => setIsAddSetupModalOpen(true)}
                                    className="rounded-md flex gap-2 body-regular text-center items-center px-3 bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                                >
                                    <FaPlus className="size-3" />
                                    Setup
                                </button>
                        }
                        <button
                            onClick={onClose}
                            className="rounded-md bg-white text-teal hover:text-teal/50 cursor-pointer"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Conditional Rendering */}
                <div className="rounded-lg bg-white overflow-hidden">
                    {isActive === 'industry' ? <IndustriesTable /> : <SetupTable />}
                </div>

                {isAddIndustryModalOpen ?

                    <AddIndustryModal onClose={() => setIsAddIndustryModalOpen(false)} />

                    : null
                }

                {
                    isAddSetupModalOpen ?
                        <AddSetupModal onClose={() => setIsAddSetupModalOpen(false)} />
                        : null
                }
            </div>
        </div>
    );
};

export default IndustriesModal;
