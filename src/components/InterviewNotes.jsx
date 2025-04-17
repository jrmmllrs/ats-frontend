import React, { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import MessageBox from "./MessageBox";
import moment from "moment";
import api from "../api/axios";
import useUserStore from "../context/userStore";
import { SlOptionsVertical } from "react-icons/sl";
import { jsPDF } from "jspdf";

const InterviewNotes = ({ interview, applicant, fetchDiscussionInterview }) => {
    const [noteBody, setNoteBody] = useState("");
    const { user } = useUserStore();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleSubmit = () => {
        const data = {
            interview_id: interview.interview_id,
            note_type: "FIRST INTERVIEW",
            note_body: noteBody,
            noted_by: user.user_id
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

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await api.get(`/interview/export/${applicant.applicant_id}/${applicant.tracking_id}`);
            const { formattedResults, applicant: applicantData } = response.data;

            if (!applicantData || !Array.isArray(applicantData) || applicantData.length === 0) {
                throw new Error("No valid applicant data returned from the server");
            }

            if (!formattedResults || !Array.isArray(formattedResults)) {
                throw new Error("No valid interview data returned from the server");
            }

            generatePDF(formattedResults, applicantData[0]);
        } catch (error) {
            console.error("Error exporting interview:", error);
            alert(`Failed to export interview: ${error.message}`);
        } finally {
            setIsExporting(false);
            setIsOpen(false);
        }
    };


    const generatePDF = (interviews, applicantInfo) => {
        try {
            // Initialize PDF document
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm"
            });

            // Use standard fonts with Avenir in the font stack
            // jsPDF has limited font support, but we can use the standard fonts with larger sizes
            // Standard available fonts in jsPDF: helvetica, courier, times, symbol, zapfdingbats
            const primaryFont = "helvetica"; // We'll use helvetica as fallback
            doc.setFont(primaryFont);

            // Set default dimensions with increased sizes
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);

            // Increase font sizes and spacing for better readability
            const lineHeight = 8;       // Increased from 6
            const paragraphSpacing = 10; // Increased from 8

            // ==================== HEADER SECTION ====================
            // Applicant name at the top, large and bold
            doc.setFontSize(22);        // Increased from 18
            doc.setFont(primaryFont, "bold");
            doc.setTextColor(0, 0, 0);

            const fullName = `${applicantInfo.first_name || ""} ${applicantInfo.middle_name ? applicantInfo.middle_name + " " : ""}${applicantInfo.last_name || ""}`.trim();
            doc.text(fullName, margin, margin);

            // Add subtitle
            doc.setFontSize(14);        // Increased from 12
            doc.setFont(primaryFont, "normal");
            doc.setTextColor(80, 80, 80); // Darker gray for better readability
            doc.text("Interview Feedback Report", margin, margin + 8);

            // Add horizontal line separator
            doc.setDrawColor(180, 180, 180); // Darker line
            doc.setLineWidth(0.5);          // Slightly thicker line
            doc.line(margin, margin + 12, pageWidth - margin, margin + 12);

            let currentY = margin + 20;

            // ==================== INTERVIEWER FEEDBACK SECTIONS ====================
            if (interviews.length === 0) {
                doc.setFontSize(14);        // Increased from 12
                doc.text("No interview records found", margin, currentY);
                currentY += lineHeight;
            } else {
                // Filter interviews to only include those with valid notes
                const validInterviews = interviews.filter(interview => {
                    const validNotes = interview.interview_notes?.filter(note =>
                        note?.note_id && note?.note_type !== "DISCUSSION" && note?.note_body) || [];
                    return validNotes.length > 0;
                });

                validInterviews.forEach((interview, index) => {
                    // Add section spacing between interviewers, but not before the first one
                    if (index > 0) {
                        currentY += paragraphSpacing * 2;
                    }

                    // Check if we need a new page before starting a new interviewer section
                    if (currentY > pageHeight - margin - 40) {
                        doc.addPage();
                        currentY = margin;
                    }

                    // Filter out DISCUSSION type notes and ensure note has valid content
                    const validNotes = interview.interview_notes?.filter(note =>
                        note?.note_id &&
                        note?.note_type !== "DISCUSSION" &&
                        note?.note_body &&
                        note.note_body.trim() !== "" &&
                        !note.note_body.includes("%Ï")) || [];

                    // Skip if no valid notes
                    if (validNotes.length === 0) {
                        return;
                    }

                    const interviewerName = interview.interviewer_first_name
                        ? `${interview.interviewer_first_name} ${interview.interviewer_last_name || ""}`.trim()
                        : "Interviewer";

                    // Interviewer name and Feedback header
                    doc.setFontSize(18);    // Increased from 14
                    doc.setFont(primaryFont, "bold");
                    doc.setTextColor(40, 40, 40); // Darker text
                    doc.text(`${interviewerName}'s Feedback`, margin, currentY);

                    // Add interview date if available - check both possible date fields
                    const interviewDate = interview.interview_date || interview.date_of_interview;
                    if (interviewDate) {
                        const formattedDate = moment(interviewDate).format("MMMM D, YYYY");
                        doc.setFontSize(12);    // Increased from 10
                        doc.setFont(primaryFont, "italic");
                        doc.setTextColor(120, 120, 120);
                        doc.text(formattedDate, pageWidth - margin, currentY, { align: "right" });
                    }


                    // Interviewer name and Feedback header
                    doc.setFontSize(18);    // Increased from 14
                    doc.setFont(primaryFont, "regular");
                    doc.setTextColor(40, 40, 40); // Darker text


                    currentY += lineHeight + 4;

                    // Process each note as a bullet point
                    validNotes.forEach((note, noteIndex) => {
                        // Check for page break with more space reserved
                        const estimatedContentHeight = 25; // Increased from 20
                        if (currentY + estimatedContentHeight > pageHeight - margin) {
                            doc.addPage();
                            currentY = margin;
                        }

                        const noteBody = note.note_body || "No content";

                        // Clean the note body - remove any control characters or weird symbols
                        const cleanNoteBody = noteBody.replace(/[^\x20-\x7E\n\r\t]/g, "");

                        // Skip empty notes after cleaning
                        if (!cleanNoteBody.trim()) {
                            return;
                        }

                        // Split the note into paragraphs
                        const paragraphs = cleanNoteBody.split(/\n+/);

                        // Add note title if available
                        if (note.note_title) {
                            doc.setFontSize(14);    // Increased from 11
                            doc.setFont(primaryFont, "bold");
                            doc.text(`• ${note.note_title}:`, margin, currentY);
                            currentY += lineHeight;
                        }

                        paragraphs.forEach(paragraph => {
                            if (!paragraph.trim()) return;

                            // Check if we need a new page
                            if (currentY > pageHeight - margin - 15) {
                                doc.addPage();
                                currentY = margin;
                            }

                            // Check for bullet points or numbered items already in the text
                            if (paragraph.trim().match(/^[●•\-\*]\s+/) || paragraph.trim().match(/^\d+[.)]\s+/)) {
                                // It's already formatted as a list item
                                const splitParagraph = doc.splitTextToSize(paragraph, contentWidth - 5);

                                doc.setFont(primaryFont, "normal");
                                doc.setFontSize(12);    // Increased from 10
                                doc.text(splitParagraph, margin + 5, currentY); // Increased indent
                                currentY += (splitParagraph.length * lineHeight);
                            } else if (paragraph.trim().length > 0) {
                                // Regular paragraph - add bullet point
                                const bulletText = `• ${paragraph.trim()}`;
                                const splitParagraph = doc.splitTextToSize(bulletText, contentWidth - 5);

                                doc.setFont(primaryFont, "normal");
                                doc.setFontSize(12);    // Increased from 10
                                doc.text(splitParagraph, margin + 5, currentY); // Increased indent
                                currentY += (splitParagraph.length * lineHeight);
                            }
                        });

                        // Add spacing after note if not the last note
                        if (noteIndex < validNotes.length - 1) {
                            currentY += paragraphSpacing;
                        }
                    });
                });

                // If no valid interviews were found after filtering
                if (validInterviews.length === 0) {
                    doc.setFontSize(14);    // Increased from 12
                    doc.setFont(primaryFont, "normal");
                    doc.text("No feedback records available", margin, currentY);
                }
            }

            // Save the PDF
            const fileName = `${fullName.replace(/\s+/g, "_")}_Interview_Report_${moment().format("YYYYMMDD")}.pdf`;
            doc.save(fileName);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please check console for details.");
        }
    };

    return (
        <div className="border border-gray-light rounded-lg bg-white">
            {/* Box Label */}
            <div className="flex border-b border-gray-light text-gray-dark">
                <div className="flex-1 p-3 pl-5 border-r border-gray-light">
                    <p className=" display">Interview Notes And Feedback</p>
                </div>
                <div className="flex-1 py-3 px-5 space-y-2">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-dark body-regular">Interviewer</p>
                        <p className="text-gray-800 border border-gray-300 rounded-md px-2">{interview.interviewer_first_name}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-gray-dark body-regular">Date</p>
                        <input type="date" className="border border-gray-light body-regular rounded-sm ml-2 p-1" value={moment(interview.date_of_interview).format("YYYY-MM-DD")} readOnly />
                    </div>
                </div>
                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <button className="flex items-center rounded-md bg-white p-1 m-3 text-sm text-teal hover:bg-gray-light cursor-pointer"
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
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? "Exporting..." : "Export"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 pb-5">
                {/* Messages */}
                <div className="max-h-150 overflow-y-auto rounded-lg py-2 px-4">
                    {interview.interview_notes.map((note) =>
                    (<MessageBox
                        key={note.note_id}
                        sender={note.noted_by}
                        date={moment(note.noted_at).format("LLL")}
                        message={note.note_body} />)
                    )}
                </div>

                {/* Message input */}
                <div className=" flex items-center gap-2">
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
        </div>
    );
};

export default InterviewNotes;