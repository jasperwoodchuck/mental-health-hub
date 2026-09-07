import {
  useMemo,
  useState,
} from "react";

import {
  generateDashboard,
} from "../api/dashboard";

import {
  modes,
  questions,
} from "./questions";

import type {
  Answer,
  Answers,
  DashboardMode,
} from "./types";

import {
  QuestionRenderer,
} from "./components/QuestionRenderer";


interface AssessmentProps {
  onComplete: (
    dashboard: Awaited<
      ReturnType<
        typeof generateDashboard
      >
    >,
  ) => void;
}


type LoadingStage = {
  label: string;
  delay: number;
};


const loadingStages: LoadingStage[] = [
  {
    label: "READING YOUR RESPONSES",
    delay: 350,
  },
  {
    label: "MAPPING YOUR CURRENT STATE",
    delay: 650,
  },
  {
    label: "FINDING PATTERNS",
    delay: 700,
  },
  {
    label: "BUILDING YOUR PLAN",
    delay: 650,
  },
  {
    label: "CALIBRATING YOUR DASHBOARD",
    delay: 500,
  },
];


function isAnswerEmpty(
  answer: Answer | undefined,
): boolean {
  if (answer === undefined) {
    return true;
  }

  if (typeof answer === "string") {
    return answer.trim().length === 0;
  }

  if (Array.isArray(answer)) {
    return answer.length === 0;
  }

  return false;
}


function LoadingScreen({
  stage,
  progress,
}: {
  stage: string;
  progress: number;
}) {
  return (
    <div className="osd-screen">
      <div className="osd-top">
        <span>
          MENTAL HEALTH HUB
        </span>

        <span>
          OSD // PERSONALIZATION
        </span>
      </div>

      <div className="osd-center">
        <div className="osd-symbol">
          MH
        </div>

        <div className="osd-title">
          BUILDING YOUR PROFILE
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
          {Math.round(progress)}%
        </div>
      </div>

      <div className="osd-log">
        <div>
          &gt; INPUT RECEIVED
        </div>

        <div>
          &gt; CONTEXT MAPPED
        </div>

        <div>
          &gt; PERSONALIZATION ENGINE ACTIVE
        </div>

        <div className="osd-active">
          &gt; {stage}
        </div>
      </div>
    </div>
  );
}


export function Assessment({
  onComplete,
}: AssessmentProps) {
  const [mode, setMode] =
    useState<DashboardMode | null>(
      null,
    );

  const [answers, setAnswers] =
    useState<Answers>({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [loadingStage, setLoadingStage] =
    useState(
      "INITIALIZING",
    );

  const [loadingProgress, setLoadingProgress] =
    useState(0);

  const [error, setError] =
    useState<string | null>(null);


  const visibleQuestions =
    useMemo(() => {
      if (!mode) {
        return [];
      }

      return questions.filter(
        (question) =>
          !question.modes ||
          question.modes.includes(mode),
      );
    }, [mode]);


  if (!mode) {
    return (
      <main className="mode-shell">
        <section className="panel mode-panel">
          <div className="panel-corner panel-corner-top" />
          <div className="panel-corner panel-corner-bottom" />

          <div className="mode-intro">
            <span className="eyebrow">
              PERSONAL WELLBEING SYSTEM
            </span>

            <h1>
              What do you need
              right now?
            </h1>

            <p>
              You don't have to figure
              everything out at once.
              Start with whatever feels
              closest to where you are.
            </p>
          </div>

          <div className="mode-grid">
            {modes.map((item) => (
              <button
                key={item.id}
                className="mode-card"
                onClick={() => {
                  setMode(item.id);
                  setAnswers({});
                  setCurrentIndex(0);
                  setError(null);
                }}
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
      <LoadingScreen
        stage={loadingStage}
        progress={loadingProgress}
      />
    );
  }


  const question =
    visibleQuestions[currentIndex];

  const currentAnswer =
    answers[question.id];

  const isLastQuestion =
    currentIndex ===
    visibleQuestions.length - 1;

  const progress =
    ((currentIndex + 1) /
      visibleQuestions.length) *
    100;


  function updateAnswer(
    value: Answer,
  ) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));

    setError(null);
  }


  async function handleNext() {
    if (
      question.required &&
      isAnswerEmpty(currentAnswer)
    ) {
      setError(
        "This one needs an answer before we continue.",
      );

      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex(
        (index) => index + 1,
      );

      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(4);

      let progressValue = 4;

      const progressTimer =
        window.setInterval(() => {
          progressValue = Math.min(
            progressValue + 2,
            94,
          );

          setLoadingProgress(
            progressValue,
          );
        }, 100);

      let accumulatedDelay = 0;

      for (
        let index = 0;
        index < loadingStages.length;
        index++
      ) {
        const stage =
          loadingStages[index];

        await new Promise<void>(
          (resolve) => {
            window.setTimeout(() => {
              setLoadingStage(
                stage.label,
              );

              resolve();
            }, accumulatedDelay);
          },
        );

        accumulatedDelay +=
          stage.delay;
      }

      const dashboard =
        await generateDashboard(
          mode,
          answers,
        );

      window.clearInterval(
        progressTimer,
      );

      setLoadingProgress(100);
      setLoadingStage(
        "PROFILE READY",
      );

      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            350,
          );
        },
      );

      onComplete(dashboard);
    } catch (err) {
      setLoading(false);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your dashboard.",
      );
    }
  }


  function handleBack() {
    if (currentIndex === 0) {
      setMode(null);
      return;
    }

    setCurrentIndex(
      (index) => index - 1,
    );

    setError(null);
  }


  return (
    <main className="assessment-shell">
      <section className="panel">
        <div className="panel-corner panel-corner-top" />
        <div className="panel-corner panel-corner-bottom" />

        <div className="assessment-header">
          <div>
            <span className="eyebrow">
              MODE //{" "}
              {mode.toUpperCase()}
            </span>

            <span className="question-counter">
              NODE{" "}
              {String(
                currentIndex + 1,
              ).padStart(2, "0")}{" "}
              /{" "}
              {String(
                visibleQuestions.length,
              ).padStart(2, "0")}
            </span>
          </div>

          <div className="progress-container">
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span className="progress-text">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="question-area">
          <span className="section-code">
            // INPUT SEQUENCE
          </span>

          <h1>
            {question.title}
          </h1>

          {question.description && (
            <p className="question-description">
              {question.description}
            </p>
          )}

          <QuestionRenderer
            question={question}
            value={currentAnswer}
            onChange={
              updateAnswer
            }
          />
        </div>

        {error && (
          <div className="error-message">
            <span>!</span>

            {error}
          </div>
        )}

        <div className="assessment-actions">
          <button
            className="button secondary"
            type="button"
            onClick={handleBack}
          >
            ← BACK
          </button>

          <button
            className="button primary"
            type="button"
            onClick={handleNext}
          >
            {isLastQuestion
              ? "BUILD MY DASHBOARD →"
              : "CONTINUE →"}
          </button>
        </div>
      </section>
    </main>
  );
}
