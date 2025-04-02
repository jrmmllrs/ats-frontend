import { FaTimes } from "react-icons/fa";
import JobsTable from "../JobsTable";
import SetupTable from "../SetupsTable";
import { useState } from "react";
import IndustriesTable from "../IndustriesTable";

const IndustriesModal = ({ onClose }) => {
    const [isActive, setIsActive] = useState(['industry']);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-3xl bg-white mx-10 p-6 pb-1 border border-gray-light ml-70">
                {/* Header Section */}
                <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                        <h1
                            onClick={() => setIsActive('industry')}
                            className={`body-regular text-gray-dark cursor-pointer hover:bg-gray-light rounded-md px-1 ${isActive == 'industry' ? "bg-teal-soft text-teal body-bold" : ""}`}
                        >
                            Industries
                        </h1>
                        <h1
                            onClick={() => setIsActive('setup')}
                            className={`body-regular text-gray-dark cursor-pointer hover:bg-gray-light rounded-md px-1 ${isActive == 'setup' ? "bg-teal-soft text-teal body-bold" : ""}`}
                        >
                            Setup
                        </h1>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md bg-white text-teal hover:text-teal/50 cursor-pointer"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                <div className="w-full bg-teal-soft p-1 rounded-xl"></div>
                <div className="rounded-lg bg-white overflow-hidden">
                    {
                        isActive == 'industry' ?
                            <IndustriesTable />
                            :
                            <SetupTable className="" />
                    }

                </div>
            </div>
        </div>
    );
};

export default IndustriesModal;
