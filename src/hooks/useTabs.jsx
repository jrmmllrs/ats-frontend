// /src/hooks/useTabs.js
import { useState, useEffect } from "react";

const MAX_TABS = 10;

export default function useTabs(storageKey = "applicant-tabs") {
    const [tabs, setTabs] = useState(() => {
        const savedTabs = localStorage.getItem(storageKey);
        return savedTabs ? JSON.parse(savedTabs) : [];
    });

    const [activeTab, setActiveTab] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(tabs));
    }, [tabs]);

    const addTab = (applicant) => {
        if (!applicant || !applicant.applicant_id) return;

        if (tabs.length >= MAX_TABS && !tabs.some(t => t.id === applicant.applicant_id)) {
            setShowWarning(true);
            return;
        }

        if (!tabs.find((t) => t.id === applicant.applicant_id)) {
            setTabs([...tabs, {
                id: applicant.applicant_id,
                name: `${applicant.first_name} ${applicant.last_name}`,
                data: applicant
            }]);
        }

        setActiveTab(applicant.applicant_id);
    };

    const closeTab = (id) => {
        setTabs((prevTabs) => {
            const newTabs = prevTabs.filter(tab => tab.id !== id);

            // If the closed tab is the active one, switch to first tab or null
            if (activeTab === id) {
                setActiveTab(null);
            }

            return newTabs;
        });
    };

    const closeAll = () => {
        if (tabs.length === 0) return; // No-op if already empty
        setTabs([]);
        setActiveTab(null);
    };


    return {
        tabs,
        activeTab,
        setActiveTab,
        addTab,
        closeTab,
        closeAll,
        showWarning,
        setShowWarning,
    };
}
