import React from 'react';
import AccessDeniedIcon from '../assets/AccessDenied.svg';

const AccessDenied = () => {
    return (
        <div className="flex flex-col items-center pt-24 px-6 py-12 min-h-screen bg-gray-50 text-top">
            <img
                src={AccessDeniedIcon}
                alt="Access Denied"
                className="w-48 h-48 mb-8"
            />
            <h1 className="text-5xl font-extrabold text-gray-90 mb-4">
                Access Denied
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                You don’t have the required permissions to view this page.
            </p>
        </div>
    );
};

export default AccessDenied;
