import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: "main_concern",
    type: "text",
    title: "What's been on your mind lately?",
    description:
      "Tell us about anything that's been bothering you or taking up your mental space.",
    placeholder:
      "Write whatever feels relevant...",
    required: true,
  },

  {
    id: "mood",
    type: "single_choice",
    title: "How have you generally been feeling lately?",
    description:
      "There is no right or wrong answer.",
    required: true,
    options: [
      {
        value: "very_low",
        label: "Very low",
      },
      {
        value: "low",
        label: "Low",
      },
      {
        value: "okay",
        label: "Okay",
      },
      {
        value: "good",
        label: "Good",
      },
      {
        value: "very_good",
        label: "Very good",
      },
    ],
  },

  {
    id: "areas",
    type: "multiple_choice",
    title: "Which areas have been affecting you recently?",
    description:
      "Select everything that feels relevant.",
    options: [
      {
        value: "school",
        label: "School",
      },
      {
        value: "family",
        label: "Family",
      },
      {
        value: "friends",
        label: "Friends",
      },
      {
        value: "sleep",
        label: "Sleep",
      },
      {
        value: "motivation",
        label: "Motivation",
      },
      {
        value: "stress",
        label: "Stress",
      },
      {
        value: "confidence",
        label: "Confidence",
      },
    ],
  },

  {
    id: "energy",
    type: "scale",
    title: "How would you rate your energy recently?",
    description:
      "1 means very low and 10 means very high.",
    min: 1,
    max: 10,
    step: 1,
    required: true,
  },

  {
    id: "routine",
    type: "single_choice",
    title: "How would you describe your daily routine?",
    required: true,
    options: [
      {
        value: "very_unstructured",
        label: "Very unstructured",
      },
      {
        value: "somewhat_unstructured",
        label: "Somewhat unstructured",
      },
      {
        value: "balanced",
        label: "Pretty balanced",
      },
      {
        value: "structured",
        label: "Well structured",
      },
    ],
  },

  {
    id: "goal",
    type: "text",
    title: "What would you most like to improve?",
    description:
      "Think about one area where you'd like things to feel a little better.",
    placeholder:
      "For example: feeling less stressed...",
    required: true,
  },
];
