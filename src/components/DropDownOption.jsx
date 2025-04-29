import { useState, useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";

const DropDownOption = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                className="flex items-center rounded-full p-1 text-sm hover:bg-gray-light cursor-pointer"
                onClick={toggleDropdown}
            >
                <SlOptionsVertical className="size-3.5 text-gray-dark" />
            </button>
            {isOpen && (
                <div className="absolute right-2 z-10 mt-2 w-min origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden cursor-pointer">
                    <button
                        className="block text-center w-full body-regular px-2 py-2 text-gray-dark hover:bg-gray-100"
                        onClick={() => {
                            onEdit()
                            setIsOpen(!isOpen)
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="block text-center w-full body-regular px-2 py-2 text-gray-dark hover:bg-gray-100"
                        onClick={() => {
                            onDelete()
                            setIsOpen(!isOpen);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default DropDownOption;
