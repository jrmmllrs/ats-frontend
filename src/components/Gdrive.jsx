import React, { useState } from 'react';
import { FaCopy, FaPaste } from "react-icons/fa";
import useUserStore from '../context/userStore';
import api from '../api/axios';

function GdriveConfig() {
    const [jsonContent, setJsonContent] = useState(null);
    const [folderId, setFolderId] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const text = await file.text();
            try {
                const parsed = JSON.parse(text);
                setJsonContent(parsed);
            } catch (err) {
                console.error("Invalid JSON file", err);
            }
        } else {
            console.error("Please upload a valid JSON file.");
        }
    };

    const handleUpload = async () => {
        if (!jsonContent || !folderId) {
            alert("Missing JSON or Folder ID");
            return;
        }
        console.log(jsonContent);
        
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block mb-1 font-semibold">GDrive JSON Credentials</label>
                <input 
                    type="file" 
                    accept="application/json"
                    onChange={handleFileChange} 
                    className="border p-2 rounded w-full" 
                />
            </div>
            <div>
                <label className="block mb-1 font-semibold">GDrive Folder ID</label>
                <input 
                    type="text" 
                    value={folderId} 
                    onChange={(e) => setFolderId(e.target.value)} 
                    className="border p-2 rounded w-full" 
                />
            </div>
            <button 
                onClick={handleUpload} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Upload
            </button>
        </div>
    );
}

export default GdriveConfig;
