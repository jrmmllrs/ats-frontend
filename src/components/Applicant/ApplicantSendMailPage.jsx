import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import useUserStore from '../../context/userStore';
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import { generateJSON } from "@tiptap/html";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  Bars3BottomLeftIcon,
  Bars3CenterLeftIcon,
  Bars3BottomRightIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import ConfirmationModal from "../Modals/ConfirmationModal";
import SendMailToast from "../../assets/SendMailToast";
import BulletList from "@tiptap/extension-bullet-list";

function ApplicantSendMailPage({ applicant }) {
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [emailContent, setEmailContent] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const { user } = useUserStore();
  const [toasts, setToasts] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BulletList,
      CodeBlock,
      Blockquote,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class: 'body-regular border border-gray-light rounded-lg min-h-100 p-5 mx-auto focus:outline-none',
      },
    },
    content: emailContent,
    onUpdate: ({ editor }) => {
      setEmailContent(editor.getHTML());
    },
  });

  const fetchTemplates = () => {
    api
      .get("/email/templates")
      .then((response) => {
        setTemplates(response.data.templates);
      })
      .catch((error) => console.error("Error fetching data:", error.message));
  };

  useEffect(() => {
    if (showTemplateModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showTemplateModal, showDeleteModal]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateSelect = (e) => {
    const selectedTitle = e.target.value;
    const template = templates.find((t) => t.title === selectedTitle);
    if (template) {
      setSelectedTemplate(selectedTitle);
      setSelectedTemplateId(template.template_id);
      setSubject(template.subject);
      setTemplateTitle(template.title);

      const jsonContent = generateJSON(template.body, [
        StarterKit,
        Underline,
        BulletList,
        CodeBlock,
        Blockquote,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ]);

      editor?.commands.setContent(jsonContent);
      setEmailContent(template.body);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateTitle) {
      alert("Please enter a title for the template.");
      return;
    }

    const data = {
      company_id: user.company_id,
      title: templateTitle,
      subject: subject,
      body: emailContent,
    };

    if (isEditingTemplate && selectedTemplateId) {
      api
        .put(`/email/templates/${selectedTemplateId}`, data)
        .then(() => {
          setShowTemplateModal(false);
          setIsEditingTemplate(false);
          setTemplateTitle("");
          fetchTemplates();
          addToast({ message: "Template updated successfully", recipient: "Template Manager" });
        })
        .catch(() => {
          addToast({ message: "Failed to update template", recipient: "Template Manager", error: true });
        });
    } else {
      api
        .post("/email/add/template", data)
        .then(() => {
          setShowTemplateModal(false);
          setTemplateTitle("");
          fetchTemplates();
          addToast({ message: "Template saved successfully", recipient: "Template Manager" });
        })
        .catch(() => {
          addToast({ message: "Failed to save template", recipient: "Template Manager", error: true });
        });
    }
  };

  const handleEditTemplate = () => {
    if (!selectedTemplateId) {
      addToast({ message: "Please select a template to edit", recipient: "Template Manager", error: true });
      return;
    }
    setIsEditingTemplate(true);
    setShowTemplateModal(true);
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplateId) {
      addToast({ message: "Please select a template to delete", recipient: "Template Manager", error: true });
      return;
    }
    setTemplateToDelete(selectedTemplateId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTemplate = () => {
    api
      .delete(`/email/templates/${templateToDelete}`)
      .then(() => {
        setShowDeleteModal(false);
        setSelectedTemplate("");
        setSelectedTemplateId(null);
        setSubject("");
        setEmailContent("");
        editor?.commands.clearContent();
        fetchTemplates();
        addToast({ message: "Template deleted successfully", recipient: "Template Manager" });
      })
      .catch(() => {
        addToast({ message: "Failed to delete template", recipient: "Template Manager", error: true });
      });
  };

  const addToast = (toast) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleSendEmail = () => {
    setShowConfirmationModal(true);
  };

  const confirmSendEmail = () => {
    setShowConfirmationModal(false);

    const formData = new FormData();
    formData.append("applicant_id", applicant.applicant_id);
    formData.append("user_id", user.user_id);
    formData.append("email_subject", subject);
    formData.append("email_body", emailContent);

    if (attachments.length > 0) {
      attachments.forEach((file) => formData.append("files", file));
    }

    api
      .post("/email/applicant", formData)
      .then(() => {
        addToast({ message: "Email has been sent successfully", recipient: applicant?.email });
        setEmailContent("");
        setSubject("");
        setAttachments([]);
        editor?.commands.clearContent();
      })
      .catch(() => {
        addToast({ message: "Failed to send email", recipient: applicant?.email, error: true });
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (fileName) => {
    setAttachments((prevAttachments) => prevAttachments.filter((file) => file.name !== fileName));
  };

  return (
    <div className="h-full mb-5">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <SendMailToast key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </div>

      {/* Confirmation Modal for Email Sending */}
      {showConfirmationModal && (
        <ConfirmationModal
          title="Send Email"
          message={`Are you sure you want to send this email to ${applicant?.first_name || 'the applicant'}?`}
          confirmText="Send"
          cancelText="Cancel"
          onConfirm={confirmSendEmail}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

      {/* Delete Template Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Delete Template"
          message="Are you sure you want to delete this template? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteTemplate}
          onCancel={() => setShowDeleteModal(false)}
          danger={true}
        />
      )}

      {/* Template Save/Edit Modal */}
      {showTemplateModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                {isEditingTemplate ? "Edit Template" : "Save as Template"}
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                {isEditingTemplate ? "Update the template details below." : "Provide a title for the template."}
              </p>
              <input
                type="text"
                placeholder="Enter template title"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setIsEditingTemplate(false);
                    setTemplateTitle("");
                  }}
                  className="rounded-md bg-teal-600/10 px-4 py-2 text-teal-600 hover:bg-teal-600/20 hover:text-teal-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="rounded-md bg-[#008080] px-4 py-2 text-white hover:bg-teal-700 text-sm"
                >
                  {isEditingTemplate ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Subject and Template Controls */}
      <div className="mb-5 flex overflow-hidden gap-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplate}
            onChange={handleTemplateSelect}
            className="border border-teal text-teal body-regular bg-white p-2 rounded-lg hover:bg-gray-light cursor-pointer"
          >
            <option value="" disabled>
              Select a Template
            </option>
            {templates.map((template) => (
              <option key={template.template_id} value={template.title}>
                {template.title}
              </option>
            ))}
          </select>
          {selectedTemplate && (
            <>
              <button
                onClick={handleEditTemplate}
                className="p-2 text-teal hover:bg-teal/10 rounded-lg"
                title="Edit Template"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDeleteTemplate}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                title="Delete Template"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        <div className="w-full flex rounded-lg border border-gray-light">
          <span className="rounded-l-lg bg-teal px-4 py-2 text-white body-regular">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 rounded-r-lg bg-white body-regular text-gray-dark p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Email Content */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-3">
        <div className="mb-4 flex gap-3 rounded-lg bg-white">
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
          <Bars3BottomLeftIcon
            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: 'left' }) ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
          <Bars3CenterLeftIcon
            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: 'center' }) ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
          <Bars3BottomRightIcon
            className={`h-6 w-6 cursor-pointer ${editor.isActive({ textAlign: 'right' }) ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
        </div>
        <EditorContent
          editor={editor}
          className="
             [&_ul]:list-disc [&_ul]:pl-6
             [&_ol]:list-decimal [&_ol]:pl-6
             [&_em]:font-inherit
             [&_strong]:font-avenir-black
             [&_strong_em]:font-inherit
             [&_em_strong]:font-inherit"
        />
      </div>

      {/* Attachments */}
      <div className="mb-5 flex border border-gray-light body-regular bg-white items-center overflow-hidden rounded-lg">
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-l-lg bg-teal px-4 py-2 text-white"
        >
          Attachments
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label>
        {attachments.length > 0 ? (
          <div className="flex items-center flex-1 gap-2 ml-2">
            {attachments.map((file) => (
              <div key={file.name} className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                <span className="text-gray-dark">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-gray-dark hover:bg-gray-dark/20 px-0.5 cursor-pointer rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="flex-1 p-2 text-gray-dark">No files selected</span>
        )}
      </div>

      {/* Send Email Button */}
      <div className="flex items-center justify-between body-regular">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsEditingTemplate(false);
              setShowTemplateModal(true);
            }}
            className="border border-teal text-teal body-regular bg-white p-2 rounded-lg hover:bg-gray-light cursor-pointer"
          >
            Save as Template
          </button>
        </div>
        <button
          onClick={handleSendEmail}
          className="rounded-lg bg-teal px-6 py-2 text-white hover:bg-teal-light cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ApplicantSendMailPage;
