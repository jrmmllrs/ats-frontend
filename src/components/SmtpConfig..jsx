import React, { useState } from 'react';
import useUserStore from '../context/userStore';
import api from '../api/axios';

const SMTPConfiguration = () => {
    const { user } = useUserStore();
    const [email] = useState(user.user_email);
    const [appPassword, setAppPassword] = useState('');

    const handleAddLink = () => {
        if (!appPassword) {
            return alert("Please enter the App Password");
        }

        const isConfirmed = window.confirm("Are you sure you want to add this password?");
        if (!isConfirmed) return;

        api.post('/user-configuration/smtp/add-credentials', {
            user_id: user.user_id, 
            app_pass: appPassword
        })
        .then(() => {
            alert('Password updated successfully');
            setAppPassword('');
        })
        .catch((err) => alert(`Error: ${err.message}`));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">SMTP Configuration</h2>
            <p className="text-gray-600 mb-6">Setup your Google SMTP configuration for automated email.</p>

            <label className="block mb-2 text-gray-700">Email</label>
            <input
                type="email"
                value={email}
                className="w-full p-2 border rounded-md mb-4 bg-gray-100"
                disabled
            />

            <label className="block mb-2 text-gray-700">App Password <span className="text-red-500">*</span></label>
            <p className="text-sm text-gray-500 mb-4">
                Follow the instructions below to generate your app password:
                <ol className="list-decimal list-inside ml-4">
                    <li>Go to your Google Account</li>
                    <li>Go to Security</li>
                    <li>Enable 2-step verification</li>
                    <li>Generate & copy your App Password</li>
                </ol>
            </p>

            <input
                type="text"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                className="w-full p-2 border rounded-md mb-6"
                placeholder="Generated Password"
            />
            
            <div className="flex justify-end">
                <button
                    onClick={handleAddLink}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                >
                    Add Password
                </button>
            </div>
        </div>
    );
};

export default SMTPConfiguration;
