import React, { useState } from "react";

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    const changeTab = (index) => {
        setActiveTab(index);
    };

    const active = "text-orange-700 border-orange-700 border-b-2";
    const inactive = "text-neutral-700 hover:border-neutral-700 hover:border-b-2";

    return (
        <div className="max-w-5xl">
            <div className="flex mb-5">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-5 py-3 ${index === activeTab ? active : inactive}`}
                        onClick={() => changeTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">{tabs[activeTab].content}</div>
        </div>
    );
};

export default Tabs;