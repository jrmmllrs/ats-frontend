import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [step, setStep] = useState(1); // 1 = Request, 2 = OTP, 3 = New Password
    const [formData, setFormData] = useState({
        user_email: '',
        otp_code: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRequestReset = async () => {
        setLoading(true);
        try {
            const res = api.post('/password/reset-request', { user_email: formData.user_email });
            setSuccess('OTP sent to your email');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const res = await api.post('/password/verify-otp', {
                user_email: formData.user_email,
                otp_code: formData.otp_code,
            });
            if (res.data.proceed) {
                setSuccess('OTP verified');
                console.log(res.data);
                
                setStep(3);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const res = await api.post('/password/reset-password', {
                user_email: formData.user_email,
                otp_code: formData.otp_code,
                newPassword: formData.newPassword,
            });
            setSuccess('Password reset successful!');
            setStep(1);
            setFormData({ user_email: '', otp_code: '', newPassword: '' });
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Reset Your Password</h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

                {step === 1 && (
                    <>
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={handleRequestReset}
                            disabled={loading}
                            className="mt-4 w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label className="block mb-2 text-sm font-medium">OTP Code</label>
                        <input
                            type="text"
                            name="otp_code"
                            value={formData.otp_code}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter the OTP"
                        />
                        <button
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="mt-4 w-full bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <label className="block mb-2 text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter new password"
                        />
                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="mt-4 w-full bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
