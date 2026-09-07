import {
  useEffect,
  useState,
} from "react";

import {
  Assessment,
} from "./assessment/Assessment";

import {
  Dashboard,
} from "./dashboard/Dashboard";

import type {
  Dashboard as DashboardData,
} from "./api/dashboard";


const DASHBOARD_STORAGE_KEY =
  "mh-hub-dashboard";


function App() {
  const [
    dashboard,
    setDashboard,
  ] = useState<
    DashboardData | null
  >(() => {
    try {
      const stored =
        localStorage.getItem(
          DASHBOARD_STORAGE_KEY,
        );

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(
        DASHBOARD_STORAGE_KEY,
      );

      return null;
    }
  });

  useEffect(() => {
    if (!dashboard) {
      localStorage.removeItem(
        DASHBOARD_STORAGE_KEY,
      );

      return;
    }

    localStorage.setItem(
      DASHBOARD_STORAGE_KEY,
      JSON.stringify(dashboard),
    );
  }, [dashboard]);

  function restart() {
    localStorage.removeItem(
      DASHBOARD_STORAGE_KEY,
    );

    setDashboard(null);
  }

  return (
    <div className="app">
      <header className="system-header">
        <div className="brand">
          <span className="brand-mark">
            MH
          </span>

          <div>
            <div className="brand-name">
              MENTAL HEALTH HUB
            </div>

            <div className="brand-subtitle">
              PERSONAL WELLBEING SYSTEM
            </div>
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
          onRestart={restart}
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
