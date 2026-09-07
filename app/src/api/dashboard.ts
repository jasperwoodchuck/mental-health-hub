import type { Answers } from "../assessment/types";

const API_URL = "http://localhost:8000";

export interface Dashboard {
  greeting: {
    title: string;
    message: string;
  };

  summary: {
    headline: string;
    description: string;
  };

  strengths: string[];

  focus_areas: {
    title: string;
    priority: "low" | "medium" | "high";
    description: string;
  }[];

  action_plan: {
    step: number;
    title: string;
    description: string;
    actions: string[];
  }[];

  daily_check_in: {
    question: string;
    type: "reflection" | "mood" | "gratitude";
  };

  encouragement: {
    title: string;
    message: string;
  };
}

export async function generateDashboard(
  answers: Answers,
): Promise<Dashboard> {
  const response = await fetch(
    `${API_URL}/dashboard/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers,
      }),
    },
  );

  if (!response.ok) {
    let message = "Failed to generate dashboard.";

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new Error(message);
  }

  return response.json();
}
