import type {
  Dashboard as DashboardData,
} from "../api/dashboard";


interface DashboardProps {
  dashboard: DashboardData;
  onRestart: () => void;
}


const modeLabels = {
  today: "TODAY",
  lonely: "CONNECTION",
  overwhelmed: "OVERLOAD",
  motivation: "MOMENTUM",
  talk: "THOUGHTS",
};


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
              PERSONAL SYSTEM //{" "}
              {modeLabels[
                dashboard.mode
              ]}
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

            PROFILE
            CALIBRATED
          </div>
        </header>


        <div className="dashboard-grid">
          {/* Personal read */}

          <section className="dashboard-card personal-read">
            <span className="card-label">
              YOUR READ // 01
            </span>

            <h2>
              {dashboard.personal_read.headline}
            </h2>

            <p>
              {
                dashboard.personal_read
                  .description
              }
            </p>
          </section>


          {/* Summary */}

          <section className="dashboard-card summary-card">
            <span className="card-label">
              RIGHT NOW // 02
            </span>

            <h2>
              {dashboard.summary.headline}
            </h2>

            <p>
              {
                dashboard.summary
                  .description
              }
            </p>
          </section>


          {/* Quick win */}

          <section className="dashboard-card quick-win-card">
            <div className="quick-win-header">
              <span className="card-label">
                QUICK WIN // 03
              </span>

              <span className="duration">
                {
                  dashboard.quick_win
                    .duration
                }
              </span>
            </div>

            <h2>
              {dashboard.quick_win.title}
            </h2>

            <p>
              {
                dashboard.quick_win
                  .description
              }
            </p>

            <div className="activation-line">
              <span />
              READY TO START
            </div>
          </section>


          {/* Strengths */}

          <section className="dashboard-card">
            <span className="card-label">
              WHAT YOU'VE GOT // 04
            </span>

            <div className="strength-list">
              {dashboard.strengths.map(
                (strength) => (
                  <article
                    className="strength-item"
                    key={strength.title}
                  >
                    <span className="strength-mark">
                      ◆
                    </span>

                    <div>
                      <strong>
                        {
                          strength.title
                        }
                      </strong>

                      <p>
                        {
                          strength.description
                        }
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>


          {/* Focus areas */}

          <section className="dashboard-card wide">
            <span className="card-label">
              FOCUS MODULES // 05
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
                        {
                          area.priority
                        }
                      </span>
                    </div>

                    <h3>
                      {area.title}
                    </h3>

                    <p>
                      {
                        area.description
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>


          {/* Action plan */}

          <section className="dashboard-card wide action-card">
            <span className="card-label">
              YOUR NEXT MOVES // 06
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
                        {
                          step.description
                        }
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


          {/* Things to try */}

          <section className="dashboard-card wide">
            <span className="card-label">
              MAYBE TRY // 07
            </span>

            <div className="try-grid">
              {dashboard.things_to_try.map(
                (item) => (
                  <article
                    className="try-card"
                    key={item.title}
                  >
                    <span>
                      +
                    </span>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>


          {/* Check in */}

          <section className="dashboard-card checkin-card">
            <span className="card-label">
              CHECK-IN // 08
            </span>

            <div className="terminal-icon">
              ?
            </div>

            <h2>
              {
                dashboard.daily_check_in
                  .question
              }
            </h2>

            <span className="checkin-type">
              {
                dashboard.daily_check_in
                  .type
              }
            </span>
          </section>


          {/* Encouragement */}

          <section className="dashboard-card encouragement-card">
            <span className="card-label">
              MESSAGE // 09
            </span>

            <div className="gear-symbol">
              ⚙
            </div>

            <h2>
              {
                dashboard.encouragement
                  .title
              }
            </h2>

            <p>
              {
                dashboard.encouragement
                  .message
              }
            </p>
          </section>
        </div>


        <footer className="dashboard-footer">
          <span>
            HUB // PROFILE
            SYNCHRONIZED
          </span>

          <button
            className="button secondary"
            onClick={onRestart}
          >
            ← START SOMEWHERE ELSE
          </button>
        </footer>
      </section>
    </main>
  );
}
