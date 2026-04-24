import { UserAnswers, RecoveryRoadmap, SymptomRating } from './types';

export function generateRoadmap(answers: UserAnswers): RecoveryRoadmap {
  // Score symptoms and prioritize top 3
  const sortedSymptoms = [...answers.symptoms]
    .filter(s => s.rating > 0)
    .sort((a, b) => b.rating - a.rating);
  
  const topSymptoms = sortedSymptoms.slice(0, 3);
  
  // Starting Focus Logic
  const symptomsText = topSymptoms.length > 0 
    ? ` addressing ${topSymptoms.map(s => s.name.toLowerCase()).join(', ')}` 
    : '';
  const focus = `Your recovery roadmap is focused on calming your nervous system while ${symptomsText} through basic, foundational movements. We will work on strengthening the brain's natural pathways to help reduce the daily impact of ${answers.mainChallenge.map(c => c.toLowerCase()).join(', ')}.`;

  // Chapter mapping based on responses
  const chapters = [];
  
  // Logic for Q1/Q3 (Main symptoms)
  if (answers.mainChallenge.some(c => c.includes('Energy')) || answers.symptoms.find(s => s.name === 'Fatigue' && s.rating >= 2)) {
    chapters.push({
      chapter: "Chapter 3: Post-Stroke Fatigue",
      focus: "Implementing the 'Energy Budget System' to manage finite neural currency during recovery."
    });
  }

  if (answers.emotionalState.length > 0 || answers.confidence === 'Not at all' || answers.confidence === 'Unsure') {
    chapters.push({
      chapter: "Chapter 4: Emotional Scars",
      focus: "Rebuilding confidence by understanding 'The Dopamine Drought' and celebrating micro-wins."
    });
  }

  if (answers.symptoms.find(s => s.name === 'Movement weakness' && s.rating >= 1) || answers.symptoms.find(s => s.name === 'Spasticity' && s.rating >= 1)) {
    chapters.push({
      chapter: "Chapter 8: The Motor Pathway",
      focus: "Rewiring movement signals through high-repetition, low-intensity neurological priming."
    });
  }

  if (answers.cognitiveIssues.length > 0 || answers.symptoms.find(s => (s.name === 'Memory' || s.name === 'Concentration') && s.rating >= 2)) {
    chapters.push({
      chapter: "Chapter 12: Cognitive Clarity",
      focus: "Addressing attention and memory through structured environmental 'anchors'."
    });
  }

  // Always include neuro-foundation chapters
  chapters.push({
    chapter: "CHAPTER 18: THE SAUNA SECRET",
    focus: "Heat therapy for passive neuroprotection and boosting brain growth proteins (BDNF)."
  });

  // Mandatory Crawling Exercises In Every Outcome
  const movementFocus = `Movement: Belly Crawling and Hand and Knee Crawling are essential daily primitives. ${
    topSymptoms.some(s => s.name === 'Balance') ? 'Focus on slow, rhythmic weight shifts.' : 'Maintain consistent cross-lateral sequencing.'
  }`;

  const roadmap: RecoveryRoadmap = {
    starting_focus: focus,
    top_priorities: topSymptoms,
    recommended_chapters: chapters.slice(0, 4), // Top 4 most relevant
    weekly_rhythm: {
      active_days: movementFocus,
      stimulation_days: "Daily Passive Stimulation + Novelty Learning: Sound/music, nutrition focus, sauna/heat if available, breathing. Novelty Learning: New skills (language phrases, rhythm games, naming objects) spark rewiring — no equipment needed.",
      daily_note: "Consistency is your greatest tool. Small, frequent signals to the brain are more effective than infrequent, long sessions."
    },
    equipment_suggestion: answers.equipment.includes('None') 
      ? 'A mirror for neuro-feedback and a comfortable floor space for crawling primitives.'
      : `Integrate your ${answers.equipment.join(', ')} into your daily 'Novelty Blocks'.`,
    next_steps: "Complete your first 7 days of daily crawling primitives. This consistency is the key to signaling your brain for adaptive change.",
    cautions: []
  };

  // Add specific cautions or modifications based on new domains
  if (answers.sensorySensitivities.length > 0 && !answers.sensorySensitivities.includes('None')) {
    roadmap.cautions.push(`Limit ${answers.sensorySensitivities.join(', ')} during active movement blocks to prevent neural fatigue.`);
  }

  if (answers.worrySymptoms.includes('Dizziness') || answers.symptoms.find(s => s.name === 'Dizziness' && s.rating >= 2)) {
    roadmap.cautions.push('Move slowly when changing positions');
    roadmap.cautions.push('Ensure a support person is present during crawling exercises if balance score is >1');
  }

  if (answers.autonomicIssues.length > 0 && !answers.autonomicIssues.includes('None')) {
    roadmap.cautions.push('Monitor temperature and fatigue levels closely; autonomic dysregulation can mask initial exhaustion signals.');
  }

  if (answers.bodyAwareness === "I have to look to know" || 
      answers.bodyAwareness.includes('disconnected')) {
    roadmap.starting_focus += " We will increase focus on visual feedback (mirror work) to compensate for limb awareness challenges.";
  }

  return roadmap;
}
