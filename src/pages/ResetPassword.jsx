import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

function ResetPassword() {
    const [step, setStep] = useState(1); // 1 = Request, 2 = OTP, 3 = New Password
    const [formData, setFormData] = useState({
        user_email: '',
        otp_code: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push(`at least ${minLength} characters`);
        if (!hasUpperCase) errors.push('an uppercase letter');
        if (!hasLowerCase) errors.push('a lowercase letter');
        if (!hasNumbers) errors.push('a number');
        if (!hasSpecialChar) errors.push('a special character');

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleRequestReset = async () => {
        if (!formData.user_email) {
            setError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.user_email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/password/reset-request', {
                user_email: formData.user_email
            });

            if (response.data && response.data.message) {
                setSuccess('OTP sent to your email');
                setStep(2);
                setCountdown(60); // Set 60 seconds countdown for resend
            } else {
                setError('Failed to send OTP');
            }
        } catch (error) {
            console.error('Reset request error:', error);
            setError(error.response?.data?.message || 'An error occurred while sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/password/reset-request', {
                user_email: formData.user_email
            });

            if (response.data && response.data.message) {
                setSuccess('New OTP sent to your email');
                setCountdown(60); // Reset countdown
            } else {
                setError('Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError(error.response?.data?.message || 'An error occurred while resending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!formData.otp_code) {
            setError('OTP is required');
            return;
        }

        if (formData.otp_code.length !== 6 || !/^\d+$/.test(formData.otp_code)) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/password/verify-otp', {
                user_email: formData.user_email,
                otp_code: formData.otp_code,
            });

            if (res.data && res.data.proceed === true) {
                setSuccess('OTP verified');
                setStep(3);
            } else {
                // Handle case where backend returns success but proceed is false
                setError(res.data?.message || 'Invalid or expired OTP');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError(err.response?.data?.error || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!formData.newPassword) {
            setError('New password is required');
            return;
        }

        const passwordValidation = validatePassword(formData.newPassword);
        if (!passwordValidation.isValid) {
            setError(`Password must contain ${passwordValidation.errors.join(', ')}`);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/password/reset-password', {
                user_email: formData.user_email,
                otp_code: formData.otp_code,
                newPassword: formData.newPassword,
            });

            if (res.data && res.data.success === true) {
                setSuccess('Password reset successful!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Handle case where API returns success:false
                setError(res.data?.message || 'Failed to reset password');
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
                        <div className="flex justify-center">
                            <div className="bg-white/20 p-3 rounded-full shadow-inner">
                                <FiLock className="text-white text-2xl" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-white mt-3">Reset Password</h2>
                        <p className="text-center text-teal-100 text-sm mt-1">
                            {step === 1 && "Enter your email to receive an OTP"}
                            {step === 2 && "Enter the OTP sent to your email"}
                            {step === 3 && "Create a new password"}
                        </p>

                        {/* Step Indicator */}
                        <div className="flex justify-center items-center space-x-4 mt-4">
                            <div className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-white' : 'bg-teal-300/50'}`}></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-white' : 'bg-teal-300/50'}`}></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-white' : 'bg-teal-300/50'}`}></div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-center mb-4">
                                <span className="text-red-500 mr-2 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center mb-4">
                                <span className="text-green-600 mr-2 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span>{success}</span>
                            </div>
                        )}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestReset}
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">OTP Code</label>
                                    <div className="flex justify-center">
                                        <input
                                            type="text"
                                            name="otp_code"
                                            value={formData.otp_code}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 text-center tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                            placeholder="Enter the 6-digit OTP"
                                            maxLength={6}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-1">
                                        OTP sent to {formData?.user_email || 'your email'}
                                    </p>
                                </div>

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </button>

                                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                    <button
                                        onClick={() => { setStep(1); setSuccess(''); }}
                                        className="text-teal-600 hover:text-teal-700 font-medium flex items-center"
                                    >
                                        <FiArrowLeft className="mr-1" /> Change email
                                    </button>

                                    <button
                                        onClick={handleResendOTP}
                                        disabled={countdown > 0}
                                        className={`text-teal-600 hover:text-teal-700 font-medium flex items-center ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FiRefreshCw className="mr-1" />
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 8 characters and include uppercase, lowercase, numbers and special characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-6">
                            <Link to="/login" className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium">
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;