import type {
  Answers,
  DashboardMode,
} from "../assessment/types";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000";


export interface Dashboard {
  mode: DashboardMode;

  greeting: {
    title: string;
    message: string;
  };

  summary: {
    headline: string;
    description: string;
  };

  personal_read: {
    headline: string;
    description: string;
  };

  strengths: {
    title: string;
    description: string;
  }[];

  focus_areas: {
    title: string;
    priority: "low" | "medium" | "high";
    description: string;
  }[];

  quick_win: {
    title: string;
    description: string;
    duration: string;
  };

  action_plan: {
    step: number;
    title: string;
    description: string;
    actions: string[];
  }[];

  things_to_try: {
    title: string;
    description: string;
  }[];

  daily_check_in: {
    question: string;
    type:
      | "reflection"
      | "mood"
      | "gratitude"
      | "intention";
  };

  encouragement: {
    title: string;
    message: string;
  };
}


export async function generateDashboard(
  mode: DashboardMode,
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
        mode,
        answers,
      }),
    },
  );

  if (!response.ok) {
    let message =
      "Failed to generate your dashboard.";

    try {
      const data =
        await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore invalid error response.
    }

    throw new Error(message);
  }

  return response.json();
}
