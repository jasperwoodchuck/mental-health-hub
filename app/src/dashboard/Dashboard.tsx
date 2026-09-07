import type {
  Dashboard as DashboardData,
} from "../api/dashboard";

interface DashboardProps {
  dashboard: DashboardData;
  onRestart: () => void;
}

export function Dashboard({
  dashboard,
  onRestart,
}: DashboardProps) {
  return (
    <main className="dashboard-shell">
      <section className="panel dashboard-panel">
        <div className="panel-corner panel-corner-top" />
        <div className="panel-corner panel-corner-bottom" />

        <header className="dashboard-header">
          <div>
            <span className="eyebrow">
              PERSONAL SYSTEM
            </span>

            <h1 className="dashboard-title">
              {dashboard.greeting.title}
            </h1>

            <p className="dashboard-subtitle">
              {dashboard.greeting.message}
            </p>
          </div>

          <div className="system-badge">
            <span className="system-dot" />
            PROFILE SYNCHRONIZED
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="dashboard-card analysis-card">
            <span className="card-label">
              ANALYSIS // 01
            </span>

            <h2>
              {dashboard.summary.headline}
            </h2>

            <p>
              {dashboard.summary.description}
            </p>
          </section>

          <section className="dashboard-card">
            <span className="card-label">
              STRENGTHS // 02
            </span>

            <ul className="strength-list">
              {dashboard.strengths.map(
                (strength) => (
                  <li key={strength}>
                    <span>◆</span>
                    {strength}
                  </li>
                ),
              )}
            </ul>
          </section>

          <section className="dashboard-card wide">
            <span className="card-label">
              FOCUS MODULES // 03
            </span>

            <div className="focus-grid">
              {dashboard.focus_areas.map(
                (area) => (
                  <article
                    className="focus-card"
                    key={area.title}
                  >
                    <div className="focus-top">
                      <span>
                        MODULE
                      </span>

                      <span
                        className={`priority priority-${area.priority}`}
                      >
                        {area.priority}
                      </span>
                    </div>

                    <h3>
                      {area.title}
                    </h3>

                    <p>
                      {area.description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>

          <section className="dashboard-card wide action-card">
            <span className="card-label">
              ACTION PROTOCOL // 04
            </span>

            <div className="action-list">
              {dashboard.action_plan.map(
                (step) => (
                  <article
                    className="action-step"
                    key={step.step}
                  >
                    <div className="step-number">
                      {String(
                        step.step,
                      ).padStart(2, "0")}
                    </div>

                    <div className="step-content">
                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                      <ul>
                        {step.actions.map(
                          (action) => (
                            <li key={action}>
                              {action}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <section className="dashboard-card checkin-card">
            <span className="card-label">
              DAILY CHECK-IN // 05
            </span>

            <div className="terminal-icon">
              ?
            </div>

            <h2>
              {dashboard.daily_check_in.question}
            </h2>

            <span className="checkin-type">
              TYPE //{" "}
              {dashboard.daily_check_in.type}
            </span>
          </section>

          <section className="dashboard-card encouragement-card">
            <span className="card-label">
              SYSTEM MESSAGE // 06
            </span>

            <div className="gear-symbol">
              ⚙
            </div>

            <h2>
              {dashboard.encouragement.title}
            </h2>

            <p>
              {dashboard.encouragement.message}
            </p>
          </section>
        </div>

        <footer className="dashboard-footer">
          <span>
            MENTAL HEALTH HUB // PERSONALIZATION
            ENGINE
          </span>

          <button
            className="button secondary"
            onClick={onRestart}
          >
            RUN NEW ASSESSMENT
          </button>
        </footer>
      </section>
    </main>
  );
}
