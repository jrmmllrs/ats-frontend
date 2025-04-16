import React, { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import MessageBox from "./MessageBox"; // Adjust path if needed
import moment from "moment";
import api from "../api/axios";
import useUserStore from "../context/userStore";
import { SlOptionsVertical } from "react-icons/sl";

const DiscussionBox = ({ applicant, discussion, fetchDiscussionInterview }) => {
    const [noteBody, setNoteBody] = useState("");
    const { user } = useUserStore();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        const data = {
            interview_id: discussion.interview_id,
            note_type: "DISCUSSION",
            note_body: noteBody,
            noted_by: user.user_id,
        }

        api.post('/interview/note', data).then((response) => {
            //trigger the change of the source data
            console.log('add note response: ', response);
            setNoteBody("");
            fetchDiscussionInterview();
        }).catch((error) => {
            console.log(error.message);
        })
    }

    return (
        <div className="border border-gray-light rounded-lg bg-white">
            {/* Box Label */}
            <div className="flex border-b border-gray-light p-4">
                <p className="flex-1 text-gray-dark headline">Discussion Box</p>
                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <button className="flex items-center rounded-md bg-white p-1 text-sm text-teal hover:bg-gray-light cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}>
                        <SlOptionsVertical className="h-4 w-4 text-teal" />
                    </button>
                    {isOpen && (
                        <div className="absolute right-2 z-10 mt-2 w-min origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden curssor-pointer">
                            <button
                                className="block text-center w-full body-regular px-2 py-2 text-gray-dark hover:bg-gray-100"
                                onClick={() => alert('Edit Interview')}
                            >
                                Edit
                            </button>
                            <button
                                className="block text-center w-full body-regular px-2 py-2 text-gray-dark hover:bg-gray-100"
                                onClick={() => alert('Delete Interview')}
                            >
                                Delete
                            </button>
                            <button
                                className="block text-center w-full body-regular px-2 py-2 text-gray-dark hover:bg-gray-100"
                                onClick={() => alert('Export Interview')}
                            >
                                Export
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 max-h-150 overflow-y-auto rounded-lg py-2">
                {discussion.interview_notes.map((note) =>
                    note.note_id != null ?
                        (<MessageBox
                            key={note.note_id}
                            sender={note.noted_by}
                            date={moment(note.noted_at).format("LLL")}
                            message={note.note_body} />) : ""
                )}
            </div>
            {/* Message input */}
            <div className=" flex items-center m-5 mt-0 gap-2">
                <textarea
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    rows="1 "
                    className="w-full p-2.5 body-regular text-gray-dark bg-white rounded-lg border border-gray-light focus:ring-blue-500 focus:border-blue-500" placeholder="Type your message..."></textarea>
                <button
                    onClick={handleSubmit}
                    className="flex p-2 items-center justify-center rounded-full border border-gray-light bg-white hover:bg-teal-soft cursor-pointer">
                    <FiSend className="h-4 w-4 text-teal" />
                </button>
            </div>
        </div>
    );
};

export default DiscussionBox;
