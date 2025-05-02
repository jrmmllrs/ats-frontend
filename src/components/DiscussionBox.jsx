import { IoMdSend } from "react-icons/io";
import MessageBox from "./MessageBox";
import moment from "moment";
import api from "../services/api";
import useUserStore from "../context/userStore";
import { SlOptionsVertical } from "react-icons/sl";
import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    ListBulletIcon,
    Bars3BottomLeftIcon,
    Bars3CenterLeftIcon,
    Bars3BottomRightIcon,
} from "@heroicons/react/24/outline";
import convertToSlack from "../utils/convertToSlack";


const DiscussionBox = ({ applicant, discussion, fetchDiscussionInterview }) => {
    const [noteBody, setNoteBody] = useState("");
    const { user } = useUserStore();
    const dropdownRef = useRef(null);
    const notesContainerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (notesContainerRef.current) {
            notesContainerRef.current.scrollTop = notesContainerRef.current.scrollHeight;
        }
    }, [discussion.interview_notes]);


    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            BulletList,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        editorProps: {
            attributes: {
                class: 'body-regular border border-gray-light rounded-lg min-h-20 max-h-[300px] p-5 mx-auto focus:outline-none overflow-y-auto',
            },
        },

        content: noteBody,
        onUpdate: ({ editor }) => {
            setNoteBody(editor.getHTML());
        },
    });

    const handleSubmit = () => {
        const slackFormattedMessage = convertToSlack(noteBody);

        const data = {
            applicant_id: applicant.applicant_id,
            interview_id: discussion.interview_id,
            interviewer_id: user.user_id,
            note_type: "DISCUSSION",
            note_body: noteBody,
            noted_by: user.user_id,
            slack_message: slackFormattedMessage,
        };

        api.post('/interview/note', data).then((response) => {
            console.log('add note response: ', response);
            setNoteBody("");
            editor?.commands.clearContent();
            fetchDiscussionInterview();
        }).catch((error) => {
            console.log(error.message);
        });
    };

    // Removed handleExport function
    // Removed generatePDF function

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
                            {/* Removed export button */}
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={notesContainerRef}
                className="px-6 max-h-130 min-h-40 overflow-y-auto rounded-lg py-2">
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
            <div className="items-center">
                <div className="border-t border-gray-200 rounded-b-lg p-2">
                    <div className="mb-2 flex gap-3 rounded-lg" >
                        <BoldIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive("bold") ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                        />
                        <ItalicIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive("italic") ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                        />
                        <UnderlineIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive("underline") ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                        />
                        <ListBulletIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive("bulletList") ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        />
                        {/* Text Align Controls */}
                        <Bars3BottomLeftIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: "left" }) ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        />
                        <Bars3CenterLeftIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: "center" }) ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        />
                        <Bars3BottomRightIcon
                            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: "right" }) ? "text-teal-600" : "text-gray-600"}`}
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        />
                    </div>
                    <div className="relative">
                        <EditorContent
                            editor={editor}
                            className="
                        [&_ul]:list-disc [&_ul]:pl-6
                        [&_ol]:list-decimal [&_ol]:pl-6
                        [&_em]:font-inherit
                        [&_strong]:font-avenir-black
                        [&_strong_em]:font-inherit
                        [&_em_strong]:font-inherit
                    "
                        />
                        <div className="absolute bottom-0 right-0 ">
                            <button
                                onClick={handleSubmit}
                                className="rounded-xl text-teal p-2 m-1 hover:text-teal-soft cursor-pointer flex items-center"
                            >
                                <IoMdSend className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscussionBox;