import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
    FiX, FiAlertCircle, FiInfo, FiCheck, FiAlertTriangle
} from "react-icons/fi";
import JobTitleChangeConfirm from "./JobTitleChangeConfirm";
import PermissionCheckbox from "./PermissionCheckbox";

const UserForm = ({ editId, jobTitles, serviceFeatures, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        user_email: "",
        user_password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        extension_name: "",
        sex: "",
        user_pic: "",
        personal_email: "",
        contact_number: "",
        birthdate: "",
        company_id: "717a6512-b8f6-4586-8431-feb3fcad585c",
        job_title_id: "",
        service_feature_ids: []
    });

    const categorizedFeatures = serviceFeatures.reduce((acc, feature) => {
        if (!acc[feature.category]) {
            acc[feature.category] = [];
        }
        acc[feature.category].push(feature);
        return acc;
    }, {});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [prevJobTitleId, setPrevJobTitleId] = useState(null);
    const [autoAssignedFeatures, setAutoAssignedFeatures] = useState([]);
    const [showJobChangeConfirm, setShowJobChangeConfirm] = useState(false);
    const [pendingJobTitleId, setPendingJobTitleId] = useState(null);

    useEffect(() => {
        if (editId) {
            fetchUserData();
        }
    }, [editId]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            // Changed to use the correct endpoint from your original code
            const res = await api.get("/user/user-accounts");
            const userData = res.data.userAccounts.find(user => user.user_id === editId);

            if (!userData) {
                throw new Error("User not found");
            }

            const initialFeatures = userData.service_features
                ? userData.service_features.map(f => f.service_feature_id)
                : [];

            setForm({
                user_email: userData.user_email,
                user_password: "",
                first_name: userData.first_name,
                middle_name: userData.middle_name,
                last_name: userData.last_name,
                extension_name: userData.extension_name,
                sex: userData.sex,
                user_pic: userData.user_pic,
                personal_email: userData.personal_email,
                contact_number: userData.contact_number,
                birthdate: userData.birthdate ? userData.birthdate.slice(0, 10) : "",
                company_id: userData.company_id || "717a6512-b8f6-4586-8431-feb3fcad585c",
                job_title_id: userData.job_title_id || "",
                service_feature_ids: initialFeatures
            });

            setPrevJobTitleId(userData.job_title_id);
            const recommended = getRecommendedFeatures(userData.job_title_id);
            setAutoAssignedFeatures(recommended);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    const getRecommendedFeatures = (jobTitleId) => {
        if (!jobTitleId || jobTitles.length === 0 || serviceFeatures.length === 0) {
            return [];
        }

        const selectedJob = jobTitles.find(job =>
            job.job_title_id === jobTitleId || job.id === jobTitleId
        );

        if (!selectedJob) return [];

        const jobTitleName = (selectedJob.job_title || selectedJob.name).toLowerCase();
        let recommendedFeatures = [];

        if (jobTitleName.includes('hr')) {
            recommendedFeatures = serviceFeatures.map(f => f.service_feature_id);
        }
        else if (jobTitleName.includes('recruiter')) {
            recommendedFeatures = serviceFeatures
                .filter(f => {
                    const featureName = f.feature_name.toLowerCase();
                    return featureName.includes('job listing') ||
                        featureName.includes('export applicant') ||
                        featureName.includes('receive email') ||
                        featureName.includes('add applicant') ||
                        featureName.includes('analytics') ||
                        featureName.includes('send mail') ||
                        featureName.includes('applicant listing') ||
                        featureName.includes('edit applicant') ||
                        featureName.includes('notification') ||
                        featureName.includes('dashboard');
                })
                .map(f => f.service_feature_id);
        }
        else if (jobTitleName.includes('interviewer')) {
            recommendedFeatures = serviceFeatures
                .filter(f => {
                    const featureName = f.feature_name.toLowerCase();
                    return featureName.includes('interview notes') ||
                        featureName.includes('applicant listing');
                })
                .map(f => f.service_feature_id);
        }
        else if (jobTitleName.includes('hiring manager')) {
            recommendedFeatures = serviceFeatures
                .filter(f => {
                    const featureName = f.feature_name.toLowerCase();
                    return featureName.includes('edit job') ||
                        featureName.includes('job listings') ||
                        featureName.includes('interview notes') ||
                        featureName.includes('send mail') ||
                        featureName.includes('applicant listing') ||
                        featureName.includes('analytics');
                })
                .map(f => f.service_feature_id);
        }

        return recommendedFeatures;
    };

    const handleJobTitleChange = (e) => {
        const newJobTitleId = e.target.value;

        if (editId && form.job_title_id !== newJobTitleId) {
            const currentRecommended = getRecommendedFeatures(form.job_title_id);
            const newRecommended = getRecommendedFeatures(newJobTitleId);

            if (JSON.stringify(currentRecommended) !== JSON.stringify(newRecommended)) {
                setPendingJobTitleId(newJobTitleId);
                setShowJobChangeConfirm(true);
                return;
            }
        }

        proceedWithJobTitleChange(newJobTitleId);
    };

    const proceedWithJobTitleChange = (newJobTitleId) => {
        const recommendedFeatures = getRecommendedFeatures(newJobTitleId);

        setForm(prev => ({
            ...prev,
            job_title_id: newJobTitleId,
            service_feature_ids: editId ? prev.service_feature_ids : recommendedFeatures
        }));

        setAutoAssignedFeatures(recommendedFeatures);
        setPrevJobTitleId(newJobTitleId);
        setShowJobChangeConfirm(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'job_title_id') {
            handleJobTitleChange(e);
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFeatureToggle = (featureId) => {
        setForm(prev => {
            const newFeatures = prev.service_feature_ids.includes(featureId)
                ? prev.service_feature_ids.filter(id => id !== featureId)
                : [...prev.service_feature_ids, featureId];
            return { ...prev, service_feature_ids: newFeatures };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...form,
                service_feature_ids: JSON.stringify(form.service_feature_ids)
            };

            if (editId) {
                // Using PUT to /user/user-accounts for updates (adjust if your API is different)
                await api.put(`/user/user-management/${encodeURIComponent(editId)}`, payload);
            } else {
                // Using POST to /user/create-user as in your original code
                await api.post("/user/create-user", payload);
            }

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message ||
                (editId ? "Failed to update user" : "Failed to create user"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-light flex justify-between items-center z-10 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {editId ? "Edit User" : "Add New User"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Account Information */}
                        <div className="space-y-4">
                            <h4 className="text-base font-medium text-gray-800">Account Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="user_email"
                                        value={form.user_email}
                                        onChange={handleChange}
                                        type="email"
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password{!editId && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        name="user_password"
                                        value={form.user_password}
                                        onChange={handleChange}
                                        type="password"
                                        required={!editId}
                                        minLength={8}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                    {!editId && (
                                        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="text-base font-medium text-gray-800">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Middle Name
                                    </label>
                                    <input
                                        name="middle_name"
                                        value={form.middle_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Extension Name
                                    </label>
                                    <input
                                        name="extension_name"
                                        value={form.extension_name}
                                        onChange={handleChange}
                                        placeholder="Jr., Sr., III"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gender
                                    </label>
                                    <select
                                        name="sex"
                                        value={form.sex}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Birthdate
                                    </label>
                                    <input
                                        name="birthdate"
                                        type="date"
                                        value={form.birthdate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="text-base font-medium text-gray-800">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Personal Email
                                    </label>
                                    <input
                                        name="personal_email"
                                        value={form.personal_email}
                                        onChange={handleChange}
                                        type="email"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contact Number
                                    </label>
                                    <input
                                        name="contact_number"
                                        value={form.contact_number}
                                        onChange={handleChange}
                                        type="tel"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Job Information */}
                        <div className="space-y-4">
                            <h4 className="text-base font-medium text-gray-800">Job Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Job Title <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="job_title_id"
                                        value={form.job_title_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm"
                                    >
                                        <option value="">Select Job Title</option>
                                        {jobTitles.map(job => (
                                            <option key={job.job_title_id} value={job.job_title_id}>
                                                {job.job_title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Company ID
                                    </label>
                                    <input
                                        name="company_id"
                                        value={form.company_id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent text-sm shadow-sm bg-gray-50"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Access Permissions */}
                        <div className="space-y-4">
                            <h4 className="text-base font-medium text-gray-800">Access Permissions</h4>
                            {Object.entries(categorizedFeatures).map(([category, features]) => (
                                <div key={category} className="space-y-2">
                                    <h5 className="text-sm font-semibold text-gray-700">{category}</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {features.map(feature => (
                                            <PermissionCheckbox
                                                key={feature.service_feature_id}
                                                feature={feature}
                                                checked={form.service_feature_ids.includes(feature.service_feature_id)}
                                                autoAssigned={autoAssignedFeatures.includes(feature.service_feature_id)}
                                                onChange={() => handleFeatureToggle(feature.service_feature_id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-light">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition-all text-sm font-medium shadow-md hover:shadow-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                        {editId ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        {editId ? "Update User" : "Create User"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Job Title Change Confirmation */}
            {showJobChangeConfirm && (
                <JobTitleChangeConfirm
                    onCancel={() => {
                        setShowJobChangeConfirm(false);
                        setForm(prev => ({ ...prev, job_title_id: prevJobTitleId }));
                    }}
                    onConfirm={() => proceedWithJobTitleChange(pendingJobTitleId)}
                />
            )}
        </div>
    );
};

export default UserForm;