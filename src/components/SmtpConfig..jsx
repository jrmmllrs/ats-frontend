import React, { useState } from 'react';
import { FaCopy, FaPaste } from "react-icons/fa";
import useUserStore from '../context/userStore';
import api from '../api/axios';

const SMTPConfiguration = () => {
    const { user } = useUserStore();
    const [email] = useState(user.user_email);
    const [appPassword, setAppPassword] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email)
            .then(() => alert("Email copied to clipboard"))
            .catch(() => alert("Failed to copy email"));
    };

    const handlePastePassword = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setAppPassword(text);
        } catch (error) {
            alert("Failed to paste password");
        }
    };

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
        <div className="max-w-md mx-auto p-6 bg-white text-gray-dark border border-gray-light rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">SMTP Configuration</h2>
            <p className="text-gray-600 mb-6">Setup your Google SMTP configuration for automated email.</p>

            {/* Email Field with Copy Button */}
            <label className="block mb-2 text-gray-dark">Email</label>
            <div className="relative flex items-center">
                <input
                    type="email"
                    value={email}
                    className="w-full p-2 border border-gray-light rounded-md bg-gray-100"
                    disabled
                />
            </div>

            {/* Password Instructions */}
            <label className="block mt-4 mb-2 text-gray-dark">
                App Password <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
                Follow the instructions below to generate your app password:
                <ol className="list-decimal list-inside ml-4">
                    <li>Go to your Google Account</li>
                    <li>Go to Security</li>
                    <li>Enable 2-step verification</li>
                    <li>Generate & copy your App Password</li>
                </ol>
            </p>

            {/* Password Field with Paste Button */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    className="w-full p-2 border border-gray-light rounded-md"
                    placeholder="Generated Password"
                />
                <button
                    onClick={handlePastePassword}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="absolute right-2 text-gray-600 hover:text-gray-900 border border-gray-light p-1 cursor-pointer rounded-md hover:bg-gray-light"
                >
                    <FaPaste />
                </button>

                {/* Tooltip */}
                {showTooltip && (
                    <div className="absolute -top-8 right-0 bg-teal-soft text-white text-xs rounded py-1 px-2 shadow-md">
                        Paste Password
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAddLink}
                    className="bg-teal text-white px-4 py-2 rounded-md cursor-pointer hover:bg-teal/70"
                >
                    Add Password
                </button>
            </div>
        </div>
    );
};

export default SMTPConfiguration;
