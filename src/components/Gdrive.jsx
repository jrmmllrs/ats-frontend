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
        const data = {
            company_id: "1111", 
            config_json: jsonContent,
            gdrive_folder_id: folderId
        }

        api.post('/user-configuration/gdrive/add-credentials', data).then((response) => {
            console.log(response);
            
            alert("added")
        }).catch((error) =>{
            alert(error.message)
        })
    };

    return (
        <div className="p-4 space-y-4">
            <div>
              
                <ul>
                     <h2>Google Drive Credentials</h2>
                    <li>Create a Google Cloud Console Account. Go to: <a href="https://console.cloud.google.com/">Google Cloud</a></li>
                    <li>Create a project</li>
                    <li>In the API's and Services, and go to library. </li>
                    <li>Search for Google Drive API and enable it.</li>
                    <li>Go to credentials tab, and create credentials and select the service accounts.</li>
                    <li>fill in the details and click 'create & continue'</li>
                    <li>In the "Role" section, select "Editor" or "Owner" and Click "Continue"</li>
                    <li>After creating the service account, go to "APIs & Services" and go to "Credentials"</li>
                    <li>Under "Service Accounts", click on the newly created account.</li>
                    <li>Go to the "Keys" tab. Click 'Add key' and select JSON</li>
                   
                </ul>
                <ul>
                    <h2>Google Drive Folder</h2>
                    <li>Create a GDrive folder and set the access to 'anyone with the link' and 'editor'</li>
                    <li>The Google Folder ID is located at the end of the URL</li>
                </ul>
                

            </div>
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
