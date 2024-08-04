import React, { useState } from "react";

const Tabs = ({ tabs, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (index) => {
        setActiveTab(index);
    };

    const active =
        "text-cyan-400 bg-neutral-700 font-bold sm:rounded-t-xl rounded-t-lg";
    const inactive = "text-neutral-200 bg-neutral-800 font-regular";

    return (
        <div className="">
            <div className="flex flex-wrap relative sm:bg-neutral-700 w-fit">
                {tabs.map((tab, index) => {
                    const nexToActiveLeft = activeTab !== index && index === activeTab - 1 && (index !== 0 || index !== tabs.length)
                    const nexToActiveRight = activeTab !== index && index === activeTab + 1 && (index !== 0 || index !== tabs.length)
                    return (
                        <button
                            key={index}
                            className={`sm:px-5 sm:py-3 px-3 py-3 xl:sr-only text-xs sm:text-lg relative transition-all ${
                                index === activeTab ? active : inactive
                            }`}
                            onClick={() => changeTab(index)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            <div className="">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
