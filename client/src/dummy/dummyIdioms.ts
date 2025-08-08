export const dummyIdioms = [
  {
    id: 1,
    title: "Break a leg",
    meaning: "Good luck",
    example: "Break a leg on your presentation tomorrow!",
    explanation:
      "This idiom is commonly used to wish someone good luck, especially before a performance.",
    category: "Encouragement",
    difficulty: "Beginner",
    votes: 156,
    comments: 23,
    createdAt: "2024-08-05",
    author: "EnglishTeacher01",
  },
  {
    id: 2,
    title: "Spill the beans",
    meaning: "To reveal a secret",
    example: "Don't spill the beans about the surprise party!",
    explanation:
      "This idiom means to accidentally or intentionally reveal secret information.",
    category: "Secrets",
    difficulty: "Intermediate",
    votes: 134,
    comments: 18,
    createdAt: "2024-08-04",
    author: "VocabMaster",
  },
  {
    id: 3,
    title: "It's raining cats and dogs",
    meaning: "It's raining heavily",
    example: "We can't go out now, it's raining cats and dogs!",
    explanation: "This colorful idiom describes very heavy rainfall.",
    category: "Weather",
    difficulty: "Beginner",
    votes: 89,
    comments: 12,
    createdAt: "2024-08-03",
    author: "WeatherWiz",
  },
  {
    id: 4,
    title: "Bite the bullet",
    meaning: "To face a difficult situation bravely",
    example: "I have to bite the bullet and tell my boss about the mistake.",
    explanation:
      "This idiom originated from soldiers biting on bullets during surgery without anesthesia.",
    category: "Courage",
    difficulty: "Advanced",
    votes: 201,
    comments: 35,
    createdAt: "2024-08-02",
    author: "HistoryBuff",
  },
  {
    id: 5,
    title: "Kill two birds with one stone",
    meaning: "To accomplish two tasks with one action",
    example:
      "By walking to work, I can exercise and save money - killing two birds with one stone.",
    explanation:
      "This idiom describes efficiently completing multiple objectives simultaneously.",
    category: "Efficiency",
    difficulty: "Intermediate",
    votes: 167,
    comments: 28,
    createdAt: "2024-08-01",
    author: "EfficiencyExpert",
  },
  {
    id: 6,
    title: "Don't count your chickens before they hatch",
    meaning: "Don't assume success before it happens",
    example:
      "I might get the job, but I won't count my chickens before they hatch.",
    explanation:
      "This idiom warns against being overconfident about future outcomes.",
    category: "Caution",
    difficulty: "Intermediate",
    votes: 143,
    comments: 21,
    createdAt: "2024-07-31",
    author: "WisdomSeeker",
  },
];

export const categories = [
  "All",
  "Encouragement",
  "Secrets",
  "Weather",
  "Courage",
  "Efficiency",
  "Caution",
];
export const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

// Mock data for idiom detail
export const mockIdiom = {
  id: 1,
  title: "Break a leg",
  meaning: "Good luck",
  example: "Break a leg on your presentation tomorrow!",
  explanation:
    "This idiom is commonly used to wish someone good luck, especially before a performance. It's believed to have originated in the theater world, where saying 'good luck' was considered bad luck.",
  etymology:
    "The phrase likely comes from the superstitious belief in the theater that wishing someone 'good luck' would actually bring bad luck. So actors would say the opposite of what they meant.",
  category: "Encouragement",
  difficulty: "Beginner",
  votes: 156,
  downvotes: 12,
  userVote: null, // null, 'up', or 'down'
  comments: [
    {
      id: 1,
      author: "EnglishLearner123",
      content:
        "This is so helpful! I never knew the theater connection. Thanks for sharing!",
      createdAt: "2024-08-07",
      likes: 8,
      userLiked: false,
      replies: [
        {
          id: 11,
          author: "GrammarGuru",
          content:
            "Yes! The theater world has so many interesting idioms and superstitions.",
          createdAt: "2024-08-07",
          likes: 3,
          userLiked: false,
        },
      ],
    },
    {
      id: 2,
      author: "TheaterKid",
      content:
        "As an actor, I can confirm we use this all the time! Never say 'good luck' in a theater!",
      createdAt: "2024-08-06",
      likes: 15,
      userLiked: true,
      replies: [],
    },
    {
      id: 3,
      author: "VocabBuilder",
      content:
        "Could you add more examples of this idiom in different contexts?",
      createdAt: "2024-08-05",
      likes: 5,
      userLiked: false,
      replies: [],
    },
  ],
  createdAt: "2024-08-05",
  author: "EnglishTeacher01",
  tags: ["theater", "good luck", "performance", "superstition"],
};
