"use client";

import { useState } from "react";
import ActiveActions from "./ActiveActions";
import IgnoredActions from "./IgnoredActions";
import CompletedActions from "./CompletedActions";

export default function UserActions() {
  const [activeTab, setActiveTab] = useState<'active' | 'ignored' | 'completed'>('active');

  return (
    <div className="px-4">
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 hover:cursor-pointer py-2 rounded-md font-medium ${
            activeTab === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('ignored')}
          className={`px-4 hover:cursor-pointer py-2 rounded-md font-medium ${
            activeTab === 'ignored'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Ignored
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 hover:cursor-pointer py-2 rounded-md font-medium ${
            activeTab === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Completed
        </button>
      </div>
      {activeTab === 'active' ? (
        <ActiveActions />
      ) : activeTab === 'ignored' ? (
        <IgnoredActions />
      ) : (
        <CompletedActions />
      )}
    </div>
  );
}
