/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SymptomRating {
  name: string;
  rating: number; // 0-3
}

export interface UserAnswers {
  mainChallenge: string[]; // Q1
  activityTolerance: string; // Q2
  symptoms: SymptomRating[]; // Q3
  homeSupport: string; // Q4
  equipment: string[]; // Q5
  confidence: string; // Q6
  worrySymptoms: string[]; // Q7
  routineChallenges: string[]; // Q8
  cognitiveIssues: string[]; // Q9
  emotionalState: string[]; // Q10
  sleepQuality: string; // Q11
  painLocations: string[]; // Q12
  sensoryChanges: string[]; // Q13
  goals: string[]; // Q14
  currentTherapies: string[]; // Q15
  autonomicIssues: string[]; // Q16
  sensorySensitivities: string[]; // Q17
  bodyAwareness: string; // Q18
}

export interface RecommendedChapter {
  chapter: string;
  focus: string;
}

export interface WeeklyRhythm {
  active_days: string;
  stimulation_days: string;
  daily_note: string;
}

export interface RecoveryRoadmap {
  starting_focus: string;
  top_priorities: SymptomRating[];
  recommended_chapters: RecommendedChapter[];
  weekly_rhythm: WeeklyRhythm;
  equipment_suggestion: string;
  next_steps: string;
  cautions: string[];
}
