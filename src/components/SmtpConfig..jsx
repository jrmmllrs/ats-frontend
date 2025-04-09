import React, { useState } from 'react';
import { FaPaste } from "react-icons/fa";
import useUserStore from '../context/userStore';
import api from '../api/axios';

const SMTPConfiguration = () => {
    const { user } = useUserStore();
    const [email] = useState(user.user_email);
    const [appPassword, setAppPassword] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const handlePastePassword = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setAppPassword(text);
        } catch (error) {
            alert("Failed to paste password");
        }
    };

    const handleAddLink = () => {
        if (!appPassword) return alert("Please enter the App Password");

        if (window.confirm("Are you sure you want to add this password?")) {
            api.post('/user-configuration/smtp/add-credentials', {
                user_id: user.user_id,
                app_pass: appPassword
            })
                .then(() => {
                    alert('Password updated successfully');
                    setAppPassword('');
                })
                .catch((err) => alert(`Error: ${err.message}`));
        }
    };

    return (
        <div className="w-full p-6 bg-white text-gray-dark border border-gray-light rounded-2xl">
            <h2 className="text-xl font-semibold mb-2">SMTP Configuration</h2>
            <p className="text-sm text-gray-600 mb-6">
                Configure your Google SMTP for automated system emails.
            </p>

            {/* Email (Read-only) */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-100 text-gray-700 p-2 rounded-md border border-gray-300 cursor-not-allowed"
                />
            </div>

            {/* App Password Field */}
            <div className="mb-2">
                <label className="block font-medium mb-1">
                    App Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={appPassword}
                        onChange={(e) => setAppPassword(e.target.value)}
                        placeholder="Paste generated password here"
                        className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <button
                        onClick={handlePastePassword}
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

            {/* Password Instructions */}
            <div className="mb-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="mb-2 font-medium">How to get App Password:</p>
                <ol className="list-decimal list-inside space-y-1 pl-3">
                    <li>Go to your Google Account</li>
                    <li>Navigate to <strong>Security</strong></li>
                    <li>Enable <strong>2-Step Verification</strong></li>
                    <li>Scroll to <strong>App Passwords</strong> & generate one</li>
                </ol>
            </div>

            {/* Submit Button */}
            <div className="text-right">
                <button
                    onClick={handleAddLink}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition"
                >
                    Add Password
                </button>
            </div>
        </div>
    );
};

export default SMTPConfiguration;
