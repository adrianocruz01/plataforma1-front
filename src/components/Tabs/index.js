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
            <div className="flex flex-wrap relative w-fit">
                {tabs.map((tab, index) => {
                    const nexToActiveLeft =
                        activeTab !== index &&
                        index === activeTab - 1 &&
                        (index !== 0 || index !== tabs.length);
                    const nexToActiveRight =
                        activeTab !== index &&
                        index === activeTab + 1 &&
                        (index !== 0 || index !== tabs.length);
                    return (
                        <button
                            key={index}
                            className={`sm:px-5 sm:py-3 px-3 py-3 text-xs sm:text-lg relative ${
                                index === activeTab ? active : inactive
                            }`}
                            onClick={() => changeTab(index)}
                        >
                            {tab.label}
                            <div
                                className={`${index === activeTab && index !== 0 ? "block" : "hidden"} absolute bottom-0 -left-3 w-3 h-3 bg-neutral-700 z-10 before:w-full before:h-full before:bg-neutral-800 before:absolute before:left-0 before:rounded-br-full`}
                            ></div>
                            <div
                                className={`${index === activeTab ? "block" : "hidden"} absolute bottom-0 -right-3 w-3 h-3 bg-neutral-700 z-10 before:w-full before:h-full before:bg-neutral-800 before:absolute before:left-0 before:rounded-bl-full`}
                            ></div>
                        </button>
                    );
                })}
            </div>
            <div className="">{tabs[activeTab].content}</div>
        </div>
    );
};

export default Tabs;
