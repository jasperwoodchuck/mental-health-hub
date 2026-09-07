import type {
  DashboardMode,
  Question,
} from "./types";

export interface ModeDefinition {
  id: DashboardMode;
  label: string;
  title: string;
  description: string;
  icon: string;
}

export const modes: ModeDefinition[] = [
  {
    id: "today",
    label: "TODAY",
    title: "I just want today to feel easier.",
    description:
      "Let's figure out what would make today a little more manageable.",
    icon: "◷",
  },
  {
    id: "lonely",
    label: "I'M FEELING LONELY",
    title: "I feel a little disconnected.",
    description:
      "Let's slow things down and think about connection.",
    icon: "◎",
  },
  {
    id: "overwhelmed",
    label: "I'M OVERWHELMED",
    title: "Everything feels like too much.",
    description:
      "Let's reduce the noise and find one place to start.",
    icon: "⚡",
  },
  {
    id: "motivation",
    label: "I CAN'T GET MOTIVATED",
    title: "I know what I need to do. I just can't start.",
    description:
      "Let's find the smallest possible first step.",
    icon: "△",
  },
  {
    id: "talk",
    label: "I WANT TO TALK",
    title: "I need somewhere to put my thoughts.",
    description:
      "You can take a moment to put things into words.",
    icon: "◌",
  },
];


export const questions: Question[] = [
  {
    id: "main_concern",
    type: "text",
    title: "What's actually going on?",
    description:
      "Don't worry about making it sound neat. Just tell us what's been taking up space in your head.",
    placeholder:
      "I've been thinking about...",
    required: true,
  },

  {
    id: "mood",
    type: "single_choice",
    title: "What's your general vibe right now?",
    required: true,
    options: [
      {
        value: "rough",
        label: "Pretty rough",
      },
      {
        value: "low",
        label: "A little low",
      },
      {
        value: "mixed",
        label: "Mixed",
      },
      {
        value: "okay",
        label: "Mostly okay",
      },
      {
        value: "good",
        label: "Actually pretty good",
      },
    ],
  },

  {
    id: "energy",
    type: "scale",
    title: "How much energy do you have in the tank?",
    description:
      "1 = basically running on empty · 10 = plenty of energy",
    min: 1,
    max: 10,
    step: 1,
    required: true,
  },

  {
    id: "areas",
    type: "multiple_choice",
    title: "What's taking up most of your bandwidth?",
    description:
      "Pick whatever applies. You can choose more than one.",
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
        value: "confidence",
        label: "Confidence",
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
        value: "future",
        label: "Thinking about the future",
      },
      {
        value: "nothing_specific",
        label: "Nothing specific",
      },
    ],
  },

  {
    id: "support",
    type: "single_choice",
    title: "When things get difficult, what usually helps?",
    options: [
      {
        value: "friends",
        label: "Talking to someone",
      },
      {
        value: "alone",
        label: "Having some alone time",
      },
      {
        value: "activity",
        label: "Doing something I enjoy",
      },
      {
        value: "routine",
        label: "Getting back into a routine",
      },
      {
        value: "nothing",
        label: "Honestly, I'm not sure",
      },
    ],
  },

  {
    id: "goal",
    type: "text",
    title: "If this actually helped, what would feel different?",
    description:
      "It doesn't have to be a huge change.",
    placeholder:
      "I'd like to feel...",
    required: true,
  },

  // -------------------------------
  // MODE-SPECIFIC QUESTIONS
  // -------------------------------

  {
    id: "today_priority",
    type: "text",
    title: "What's the one thing making today harder?",
    placeholder:
      "The thing I keep thinking about is...",
    modes: ["today"],
  },

  {
    id: "lonely_connection",
    type: "single_choice",
    title: "What kind of connection are you missing?",
    modes: ["lonely"],
    options: [
      {
        value: "someone_to_talk",
        label: "Someone to talk to",
      },
      {
        value: "being_around_people",
        label: "Just being around people",
      },
      {
        value: "feeling_understood",
        label: "Feeling understood",
      },
      {
        value: "belonging",
        label: "Feeling like I belong somewhere",
      },
      {
        value: "not_sure",
        label: "I'm not really sure",
      },
    ],
  },

  {
    id: "overwhelm_source",
    type: "text",
    title: "What feels like the biggest pile-up?",
    modes: ["overwhelmed"],
    placeholder:
      "There are too many things like...",
  },

  {
    id: "motivation_block",
    type: "single_choice",
    title: "What's getting in the way of starting?",
    modes: ["motivation"],
    options: [
      {
        value: "dont_know_where",
        label: "I don't know where to start",
      },
      {
        value: "too_big",
        label: "The task feels too big",
      },
      {
        value: "tired",
        label: "I'm tired",
      },
      {
        value: "distracted",
        label: "I keep getting distracted",
      },
      {
        value: "dont_care",
        label: "I don't really care about it",
      },
      {
        value: "afraid",
        label: "I'm worried I'll mess it up",
      },
    ],
  },

  {
    id: "talk_topic",
    type: "text",
    title: "If you could say anything right now, what would you say?",
    modes: ["talk"],
    placeholder:
      "Honestly, I just want to say...",
  },
];
