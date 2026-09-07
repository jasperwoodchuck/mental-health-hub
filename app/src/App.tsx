import { useState } from "react";

import {
  Assessment,
} from "./assessment/Assessment";

import {
  Dashboard,
} from "./dashboard/Dashboard";

import type {
  Dashboard as DashboardData,
} from "./api/dashboard";

function App() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  return (
    <div className="app">
      <header className="system-header">
        <div>
          <div className="system-label">
            MENTAL HEALTH HUB // CORE
          </div>
        </div>

        <div className="system-status">
          <span className="status-light" />
          SYSTEM ONLINE
        </div>
      </header>

      {dashboard ? (
        <Dashboard
          dashboard={dashboard}
          onRestart={() => setDashboard(null)}
        />
      ) : (
        <Assessment
          onComplete={setDashboard}
        />
      )}
    </div>
  );
}

export default App;
