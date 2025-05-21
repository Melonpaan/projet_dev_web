import { useState } from "react";
import "./Tabs.css";

export default function Tabs({ tabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={tab.id === activeId ? "tab-button active" : "tab-button"}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeId)?.content}
      </div>
    </div>
  );
}

