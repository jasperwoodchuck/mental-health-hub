import { useMemo, useState } from "react";

import {
  generateDashboard,
} from "../api/dashboard";

import {
  questions,
} from "./questions";

import type {
  Answer,
  Answers,
} from "./types";

import {
  QuestionRenderer,
} from "./components/QuestionRenderer";

interface AssessmentProps {
  onComplete: (
    dashboard: Awaited<
      ReturnType<typeof generateDashboard>
    >,
  ) => void;
}

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

export function Assessment({
  onComplete,
}: AssessmentProps) {
  const [answers, setAnswers] =
    useState<Answers>({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const visibleQuestions = useMemo(
    () => questions,
    [],
  );

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

  function updateAnswer(value: Answer) {
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
        "Please answer this question before continuing.",
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

      const dashboard =
        await generateDashboard(answers);

      onComplete(dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (currentIndex === 0 || loading) {
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
              PERSONAL CALIBRATION
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

          <h1>{question.title}</h1>

          {question.description && (
            <p className="question-description">
              {question.description}
            </p>
          )}

          <QuestionRenderer
            question={question}
            value={currentAnswer}
            onChange={updateAnswer}
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
            disabled={
              currentIndex === 0 ||
              loading
            }
          >
            ← BACK
          </button>

          <button
            className="button primary"
            type="button"
            onClick={handleNext}
            disabled={loading}
          >
            {loading
              ? "CALIBRATING..."
              : isLastQuestion
                ? "INITIALIZE PROFILE →"
                : "CONTINUE →"}
          </button>
        </div>
      </section>
    </main>
  );
}
