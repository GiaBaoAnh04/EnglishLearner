import React, { Dispatch, SetStateAction } from "react";

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: "my-idioms" | "liked-idioms";
  setActiveTab: Dispatch<SetStateAction<"my-idioms" | "liked-idioms">>;
}

export default function ProfileTabs({
  tabs,
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as "my-idioms" | "liked-idioms")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
