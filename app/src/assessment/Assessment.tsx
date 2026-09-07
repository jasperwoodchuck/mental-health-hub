import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  questions,
  modes,
} from "./questions";

import type {
  Answers,
  DashboardMode,
} from "./types";

import {
  QuestionRenderer,
} from "./components/QuestionRenderer";

import {
  generateDashboard,
} from "../api/dashboard";


interface AssessmentProps {
  onComplete: (
    dashboard: Awaited<
      ReturnType<typeof generateDashboard>
    >,
  ) => void;
}


const OSD_STAGES = [
  "READING INPUT",
  "MAPPING RESPONSES",
  "BUILDING PERSONAL MODEL",
  "CALIBRATING RECOMMENDATIONS",
  "FINALIZING PROFILE",
];


export function Assessment({
  onComplete,
}: AssessmentProps) {
  const [
    mode,
    setMode,
  ] = useState<
    DashboardMode | null
  >(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    answers,
    setAnswers,
  ] = useState<Answers>({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    stage,
    setStage,
  ] = useState(OSD_STAGES[0]);

  const visibleQuestions = useMemo(() => {
    if (!mode) {
      return [];
    }

    return questions.filter(
      (question) =>
        !question.modes ||
        question.modes.includes(mode),
    );
  }, [mode]);

  const currentQuestion =
    visibleQuestions[currentIndex];

  const currentAnswer =
    currentQuestion
      ? answers[currentQuestion.id]
      : undefined;

  const isLastQuestion =
    currentIndex ===
    visibleQuestions.length - 1;

  const hasAnswer =
    currentAnswer !== undefined &&
    currentAnswer !== "" &&
    !(
      Array.isArray(currentAnswer) &&
      currentAnswer.length === 0
    );

  useEffect(() => {
    if (!loading) {
      return;
    }

    setProgress(0);
    setStage(OSD_STAGES[0]);

    const startTime = Date.now();

    const timer = window.setInterval(() => {
      const elapsed =
        Date.now() - startTime;

      /*
       * Keep the visual animation moving,
       * but never let it reach 100% before
       * the API response is ready.
       */
      const visualProgress = Math.min(
        94,
        Math.round(
          (elapsed / 5000) * 94,
        ),
      );

      setProgress(
        visualProgress,
      );

      const stageIndex = Math.min(
        OSD_STAGES.length - 1,
        Math.floor(
          visualProgress /
            (94 / OSD_STAGES.length),
        ),
      );

      setStage(
        OSD_STAGES[stageIndex],
      );
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [loading]);

  function selectMode(
    selectedMode: DashboardMode,
  ) {
    setMode(selectedMode);
    setCurrentIndex(0);
    setAnswers({});
    setError(null);
  }

  function updateAnswer(
    value:
      | string
      | string[]
      | number,
  ) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));

    setError(null);
  }

  function goBack() {
    if (currentIndex === 0) {
      setMode(null);
      return;
    }

    setCurrentIndex(
      (current) => current - 1,
    );
    setError(null);
  }

  async function submitAssessment() {
    if (!mode || !hasAnswer) {
      return;
    }

    setError(null);
    setLoading(true);

    /*
     * Start the real request immediately.
     * The OSD animation runs independently.
     */
    try {
      const dashboard =
        await generateDashboard(
          mode,
          answers,
        );

      /*
       * Give the final calibration state
       * a short visual moment after the
       * actual response has arrived.
       */
      setStage(
        "PROFILE CALIBRATED",
      );
      setProgress(100);

      await new Promise<void>(
        (resolve) =>
          window.setTimeout(
            resolve,
            350,
          ),
      );

      onComplete(dashboard);
    } catch (requestError) {
      console.error(
        "Dashboard generation failed:",
        requestError,
      );

      setLoading(false);
      setProgress(0);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to generate your dashboard.",
      );
    }
  }

  async function next() {
    if (!hasAnswer) {
      setError(
        "Please provide a response before continuing.",
      );

      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex(
        (current) => current + 1,
      );

      return;
    }

    await submitAssessment();
  }

  if (!mode) {
    return (
      <main className="mode-shell">
        <section className="panel mode-panel">
          <div className="panel-corner panel-corner-top" />
          <div className="panel-corner panel-corner-bottom" />

          <div className="mode-intro">
            <span className="eyebrow">
              MENTAL HEALTH HUB // INITIALIZE
            </span>

            <h1>
              Where should we start?
            </h1>

            <p>
              Choose what feels most relevant
              right now. Your answers will shape
              the dashboard we build for you.
            </p>
          </div>

          <div className="mode-grid">
            {modes.map((item) => (
              <button
                type="button"
                className="mode-card"
                key={item.id}
                onClick={() =>
                  selectMode(item.id)
                }
              >
                <span className="mode-icon">
                  {item.icon}
                </span>

                <span className="mode-label">
                  {item.label}
                </span>

                <strong>
                  {item.title}
                </strong>

                <small>
                  {item.description}
                </small>

                <span className="mode-arrow">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="osd-screen">
        <div className="osd-top">
          <span>
            MH-HUB // PERSONAL SYSTEM
          </span>

          <span>
            BUILD 01
          </span>
        </div>

        <div className="osd-center">
          <div className="osd-symbol">
            ◆
          </div>

          <div className="osd-title">
            GENERATING YOUR PROFILE
          </div>

          <div className="osd-stage">
            {stage}
          </div>

          <div className="osd-progress">
            <div
              className="osd-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="osd-percentage">
            {progress}%
          </div>
        </div>

        <div className="osd-log">
          <div>
            [ OK ] INPUT MATRIX RECEIVED
          </div>

          <div>
            [ OK ] RESPONSE PATTERNS MAPPED
          </div>

          <div className="osd-active">
            [ ... ] {stage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="assessment-shell">
      <section className="panel">
        <div className="panel-corner panel-corner-top" />
        <div className="panel-corner panel-corner-bottom" />

        <header className="assessment-header">
          <div>
            <span className="eyebrow">
              ASSESSMENT //{" "}
              {mode.toUpperCase()}
            </span>

            <span className="question-counter">
              QUESTION{" "}
              {currentIndex + 1}
              {" / "}
              {visibleQuestions.length}
            </span>
          </div>

          <div className="progress-container">
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    ((currentIndex + 1) /
                      visibleQuestions.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <span className="progress-text">
              {Math.round(
                ((currentIndex + 1) /
                  visibleQuestions.length) *
                  100,
              )}
              %
            </span>
          </div>
        </header>

        {currentQuestion && (
          <div className="question-area">
            <span className="eyebrow">
              INPUT //{" "}
              {String(
                currentIndex + 1,
              ).padStart(2, "0")}
            </span>

            <h1>
              {currentQuestion.title}
            </h1>

            {currentQuestion.description && (
              <p className="question-description">
                {
                  currentQuestion.description
                }
              </p>
            )}

            <QuestionRenderer
              question={currentQuestion}
              value={currentAnswer}
              onChange={updateAnswer}
            />

            {error && (
              <div className="error-message">
                <span>!</span>
                {error}
              </div>
            )}
          </div>
        )}

        <div className="assessment-actions">
          <button
            type="button"
            className="button secondary"
            onClick={goBack}
          >
            ← BACK
          </button>

          <button
            type="button"
            className="button primary"
            disabled={!hasAnswer}
            onClick={next}
          >
            {isLastQuestion
              ? "GENERATE PROFILE →"
              : "CONTINUE →"}
          </button>
        </div>
      </section>
    </main>
  );
}
