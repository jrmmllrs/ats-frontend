import { useEffect, useState } from "react";
import useUserStore from "../../context/userStore";
import { addSetup } from "../../utils/setupUtils";
import setupStore from "../../context/setupStore";

const AddSetupModal = ({ onClose }) => {
    const { setSetupData } = setupStore();
    const { user } = useUserStore();
    const [setup, setsetup] = useState({
        setup_name: "",
        userId: "",
    });

    useEffect(() => {
        if (user) {
            setsetup((prev) => ({
                ...prev,
                userId: user.user_id,
            }))
        }
    },[user]);

    const handleChange = (e) => {
        setsetup({ ...setup, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();  
        addSetup(setSetupData, setup);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-3xl bg-white mx-10 p-6 body-regular border border-gray-light w-[400px]">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b-2 border-gray-light">
                    <h1 className="headline font-semibold text-gray-dark">Add New Setup</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Industry Name */}
                    <div>
                        <label className="block text-gray-700">Setup Name</label>
                        <input
                            type="text"
                            name="setupName"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-teal text-teal rounded-md hover:bg-teal-soft cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/80 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSetupModal;
