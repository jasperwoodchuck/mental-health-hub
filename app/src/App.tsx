import {
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


function App() {
  const [
    dashboard,
    setDashboard,
  ] = useState<
    DashboardData | null
  >(null);


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
          onRestart={() =>
            setDashboard(null)
          }
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
