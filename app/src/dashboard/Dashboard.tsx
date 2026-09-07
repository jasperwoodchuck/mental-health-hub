import { useEffect, useMemo, useState } from "react";

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


function getStorageKey(
  dashboard: DashboardData,
) {
  return `mh-hub-dashboard-${dashboard.mode}`;
}


export function Dashboard({
  dashboard,
  onRestart,
}: DashboardProps) {
  const storageKey = getStorageKey(dashboard);

  const [completedActions, setCompletedActions] =
    useState<Record<string, boolean>>(() => {
      try {
        const stored =
          localStorage.getItem(
            `${storageKey}-actions`,
          );

        return stored
          ? JSON.parse(stored)
          : {};
      } catch {
        return {};
      }
    });

  const [checkInAnswer, setCheckInAnswer] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            `${storageKey}-checkin`,
          ) ?? ""
        );
      } catch {
        return "";
      }
    });

  const [checkInSaved, setCheckInSaved] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            `${storageKey}-checkin-saved`,
          ) === "true"
        );
      } catch {
        return false;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      `${storageKey}-actions`,
      JSON.stringify(completedActions),
    );
  }, [
    completedActions,
    storageKey,
  ]);

  useEffect(() => {
    if (checkInAnswer) {
      localStorage.setItem(
        `${storageKey}-checkin`,
        checkInAnswer,
      );
    }
  }, [
    checkInAnswer,
    storageKey,
  ]);

  useEffect(() => {
    localStorage.setItem(
      `${storageKey}-checkin-saved`,
      String(checkInSaved),
    );
  }, [
    checkInSaved,
    storageKey,
  ]);

  const totalActions = useMemo(
    () =>
      dashboard.action_plan.reduce(
        (total, step) =>
          total + step.actions.length,
        0,
      ),
    [dashboard.action_plan],
  );

  const completedCount = useMemo(
    () =>
      dashboard.action_plan.reduce(
        (total, step) =>
          total +
          step.actions.filter(
            (_, actionIndex) =>
              completedActions[
                `${step.step}-${actionIndex}`
              ],
          ).length,
        0,
      ),
    [
      dashboard.action_plan,
      completedActions,
    ],
  );

  const progress =
    totalActions === 0
      ? 0
      : Math.round(
          (completedCount / totalActions) *
            100,
        );

  function toggleAction(
    stepNumber: number,
    actionIndex: number,
  ) {
    const key = `${stepNumber}-${actionIndex}`;

    setCompletedActions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function saveCheckIn() {
    if (!checkInAnswer.trim()) {
      return;
    }

    setCheckInSaved(true);
  }

  function editCheckIn() {
    setCheckInSaved(false);
  }

  function restart() {
    try {
      localStorage.removeItem(
        `${storageKey}-actions`,
      );

      localStorage.removeItem(
        `${storageKey}-checkin`,
      );

      localStorage.removeItem(
        `${storageKey}-checkin-saved`,
      );
    } catch {
      // Ignore storage failures.
    }

    onRestart();
  }

  return (
    <main className="dashboard-shell">
      <section className="panel dashboard-panel">
        <div className="panel-corner panel-corner-top" />
        <div className="panel-corner panel-corner-bottom" />

        <header className="dashboard-header">
          <div>
            <span className="eyebrow">
              PERSONAL SYSTEM //{" "}
              {modeLabels[dashboard.mode]}
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
            PROFILE CALIBRATED
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="dashboard-card personal-read">
            <span className="card-label">
              YOUR READ // 01
            </span>

            <h2>
              {dashboard.personal_read.headline}
            </h2>

            <p>
              {dashboard.personal_read.description}
            </p>
          </section>

          <section className="dashboard-card summary-card">
            <span className="card-label">
              RIGHT NOW // 02
            </span>

            <h2>
              {dashboard.summary.headline}
            </h2>

            <p>
              {dashboard.summary.description}
            </p>
          </section>

          <section className="dashboard-card quick-win-card">
            <div className="quick-win-header">
              <span className="card-label">
                QUICK WIN // 03
              </span>

              <span className="duration">
                {dashboard.quick_win.duration}
              </span>
            </div>

            <h2>
              {dashboard.quick_win.title}
            </h2>

            <p>
              {dashboard.quick_win.description}
            </p>

            <div className="activation-line">
              <span />
              READY TO START
            </div>
          </section>

          <section className="dashboard-card">
            <span className="card-label">
              WHAT YOU&apos;VE GOT // 04
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
                        {strength.title}
                      </strong>

                      <p>
                        {strength.description}
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

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
                      <span>MODULE</span>

                      <span
                        className={`priority priority-${area.priority}`}
                      >
                        {area.priority}
                      </span>
                    </div>

                    <h3>{area.title}</h3>

                    <p>
                      {area.description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* Action plan */}
          <section className="dashboard-card wide action-card">
            <div className="action-header">
              <div>
                <span className="card-label">
                  YOUR NEXT MOVES // 06
                </span>

                <p className="action-progress-label">
                  {completedCount}/{totalActions} ACTIONS COMPLETE
                </p>
              </div>

              <div className="action-progress">
                <div className="action-progress-track">
                  <div
                    className="action-progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <span>{progress}%</span>
              </div>
            </div>

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
                      <h3>{step.title}</h3>

                      <p>
                        {step.description}
                      </p>

                      <ul className="action-items">
                        {step.actions.map(
                          (
                            action,
                            actionIndex,
                          ) => {
                            const key = `${step.step}-${actionIndex}`;
                            const completed =
                              Boolean(
                                completedActions[
                                  key
                                ],
                              );

                            return (
                              <li
                                key={key}
                                className={
                                  completed
                                    ? "action-item completed"
                                    : "action-item"
                                }
                              >
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={
                                      completed
                                    }
                                    onChange={() =>
                                      toggleAction(
                                        step.step,
                                        actionIndex,
                                      )
                                    }
                                  />

                                  <span className="action-checkbox">
                                    {completed
                                      ? "✓"
                                      : ""}
                                  </span>

                                  <span className="action-text">
                                    {action}
                                  </span>
                                </label>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

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
                    <span>+</span>

                    <div>
                      <h3>{item.title}</h3>

                      <p>
                        {item.description}
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* Daily check-in */}
          <section className="dashboard-card checkin-card">
            <span className="card-label">
              CHECK-IN // 08
            </span>

            <div className="terminal-icon">
              ?
            </div>

            <h2>
              {dashboard.daily_check_in.question}
            </h2>

            {checkInSaved ? (
              <div className="checkin-complete">
                <span className="checkin-complete-mark">
                  ✓
                </span>

                <div>
                  <strong>CHECK-IN SAVED</strong>

                  <p>{checkInAnswer}</p>

                  <button
                    type="button"
                    className="checkin-edit"
                    onClick={editCheckIn}
                  >
                    EDIT RESPONSE
                  </button>
                </div>
              </div>
            ) : (
              <div className="checkin-form">
                <textarea
                  className="checkin-input"
                  value={checkInAnswer}
                  onChange={(event) =>
                    setCheckInAnswer(
                      event.target.value,
                    )
                  }
                  placeholder="Type a short response..."
                  rows={3}
                />

                <button
                  type="button"
                  className="button primary checkin-button"
                  disabled={
                    !checkInAnswer.trim()
                  }
                  onClick={saveCheckIn}
                >
                  SAVE CHECK-IN
                </button>
              </div>
            )}

            <span className="checkin-type">
              {dashboard.daily_check_in.type}
            </span>
          </section>

          <section className="dashboard-card encouragement-card">
            <span className="card-label">
              MESSAGE // 09
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
            HUB // PROFILE SYNCHRONIZED
          </span>

          <button
            className="button secondary"
            onClick={restart}
          >
            ← START SOMEWHERE ELSE
          </button>
        </footer>
      </section>
    </main>
  );
}
