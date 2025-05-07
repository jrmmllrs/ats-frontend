import React, { useState } from 'react';
import { FaCopy, FaPaste } from "react-icons/fa";
import useUserStore from '../context/userStore';
import api from '../services/api';

function GdriveConfig() {
    const [jsonContent, setJsonContent] = useState(null);
    const [folderId, setFolderId] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePasteFolderID = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setFolderId(text);
        } catch (error) {
            alert("Failed to paste folder ID");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const text = await file.text();
            try {
                const parsed = JSON.parse(text);
                setJsonContent(parsed);
            } catch (err) {
                console.error("Invalid JSON file", err);
                alert("Invalid JSON file. Please check the content.");
            }
        } else {
            alert("Please upload a valid JSON file.");
        }
    };

    const handleUpload = async () => {
        setIsLoading(true);
        if (!jsonContent || !folderId) {
            alert("Missing JSON or Folder ID");
            return;
        }

        const data = {
            company_id: "1111",
            config_json: jsonContent,
            gdrive_folder_id: folderId
        };

        try {
            const response = await api.post('/user-configuration/gdrive/add-credentials', data);
            console.log(response);
            alert("Google Drive credentials successfully added!");
        } catch (error) {
            alert(`Upload failed: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-6 bg-white text-gray-dark border border-gray-light rounded-2xl">
            <div>
                <h2 className="text-xl font-bold mb-2">How to Setup Google Drive Integration</h2>

                <div className="space-y-2 text-sm text-gray-700">
                    <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h3 className="font-semibold">Google Drive Credentials</h3>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Create a Google Cloud Console Account: <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud</a></li>
                            <li>Create a new project.</li>
                            <li>Enable the "Google Drive API" under APIs & Services → Library.</li>
                            <li>Create credentials and select "Service Account".</li>
                            <li>Give it a name and role (Editor or Owner).</li>
                            <li>Go to the "Keys" tab → Add key → JSON. Download the file.</li>
                        </ol>
                    </div>

                    <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h3 className="font-semibold">Google Drive Folder</h3>
                        <ul className="list-disc list-inside">
                            <li>Create a folder in Google Drive.</li>
                            <li>Share it with “anyone with the link” and set them as Editor.</li>
                            <li>The folder ID is at the end of the URL after `/folders/`.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='mb-2'>
                <label className="block mb-1 font-semibold">Upload GDrive JSON Credentials</label>
                <input
                    type="file"
                    accept="application/json"
                    onChange={handleFileChange}
                    className="border border-gray-300 p-1 rounded-md w-full text-sm file:bg-gray-100 file:border-none file:rounded file:px-4 file:py-2 file:mr-4 file:text-gray-700"
                />
            </div>

            <div className='mb-2'>
                <label className="block mb-1 font-semibold">Enter GDrive Folder ID</label>
                <div className="relative">
                    <input
                        type="text"
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full text-sm"
                        placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74"
                    />
                    <button
                        onClick={handlePasteFolderID}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"
                    >
                        <FaPaste size={14} />
                    </button>
                    {showTooltip && (
                        <div className="absolute top-[-32px] right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">
                            Paste Password
                        </div>
                    )}
                </div>

            </div>

            <div className="text-right">
                <button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Upload Credentials'
                    )}
                </button>
            </div>
        </div>
    );
}

export default GdriveConfig;
