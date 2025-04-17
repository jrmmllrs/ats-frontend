import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { addIndustry, editIndustry } from "../../utils/industriesUtils";
import industriesStore from "../../context/industriesStore";
import useUserStore from "../../context/userStore";

const AddIndustryModal = ({ onClose, industry }) => {
    const { setIndustries } = industriesStore();
    const { user } = useUserStore();
    const [industryData, setIndustryData] = useState({
        industryName: "",
        assessmentUrl: "",
        userId: ""
    });

    useEffect(() => {
        if (user) {
            setIndustryData((prev) => ({
                industryName: industry ? industry.industryName : "",
                assessmentUrl: industry ? industry.assessmentUrl : "",
                userId: user.user_id,
            }))
        }
    }, [user]);

    const handleChange = (e) => {
        setIndustryData({ ...industryData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        industry ? await editIndustry(setIndustries, industryData, industry.industryId) : await addIndustry(setIndustries, industryData);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-3xl bg-white mx-10 p-6 body-regular border border-gray-light w-[400px]">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b-2 border-gray-light">
                    <h1 className="headline font-semibold text-gray-dark">{industry ? "Edit Industry" : "Add New Industry"}</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Industry Name */}
                    <div>
                        <label className="block text-gray-700">Industry Name</label>
                        <input
                            type="text"
                            name="industryName"
                            value={industryData.industryName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Assessment URL */}
                    <div>
                        <label className="block text-gray-700">Assessment URL</label>
                        <input
                            type="text"
                            name="assessmentUrl"
                            value={industryData.assessmentUrl}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
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

export default AddIndustryModal;
