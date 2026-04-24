import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Battery, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  ChevronLeft,
  RefreshCcw,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Move,
  Activity,
  Smile,
  MessageSquare,
  Eye,
  Brain,
  ShieldCheck,
  Stethoscope,
  Wind
} from 'lucide-react';
import { generateRoadmap } from './roadmapGenerator';
import { UserAnswers, RecoveryRoadmap, SymptomRating } from './types';

const SYMPTOMS_LIST = [
  "Movement weakness", "Balance", "Pain", "Spasticity", "Fatigue", "Sleep issues", "Vision", 
  "Hearing/tinnitus", "Numbness", "Swallowing", "Memory", "Concentration", "Slow thinking", 
  "Speech", "Word-finding", "Mood changes", "Anxiety", "Irritability", "Confidence", "Headaches", 
  "Dizziness", "Appetite"
];

const QUESTIONS = [
  {
    id: 1,
    text: "Main challenge right now? (Select all that apply)",
    type: "multi",
    options: ["Movement/mobility", "Energy/fatigue", "Mood/emotions", "Speech", "Swallowing", "Vision/spatial", "Pain", "Memory/thinking", "Confidence", "None", "Other"],
    field: "mainChallenge"
  },
  {
    id: 2,
    text: "Activity tolerance?",
    type: "select",
    options: ["Very low", "Low", "Moderate", "Good", "High"],
    field: "activityTolerance"
  },
  {
    id: 3,
    text: "Rate symptoms (0=none, 1=mild, 2=mod, 3=severe)",
    type: "rating_list",
    options: SYMPTOMS_LIST,
    field: "symptoms"
  },
  {
    id: 4,
    text: "Home support?",
    type: "select",
    options: ["Alone", "Family", "Caregiver", "Professional"],
    field: "homeSupport"
  },
  {
    id: 5,
    text: "Equipment available?",
    type: "multi",
    options: ["Ball", "Bands", "Walker", "Mirror", "None", "Other"],
    field: "equipment"
  },
  {
    id: 6,
    text: "Confidence level?",
    type: "select",
    options: ["Not at all", "Unsure", "Moderate", "Quite", "Very"],
    field: "confidence"
  },
  {
    id: 7,
    text: "Worry symptoms?",
    type: "multi",
    options: ["Fatigue", "Dizziness", "Swallowing", "Vision", "Pain", "Mood", "None"],
    field: "worrySymptoms"
  },
  {
    id: 8,
    text: "Daily routine challenges?",
    type: "multi",
    options: ["Dressing", "Eating", "Bathing", "Walking", "Driving", "None"],
    field: "routineChallenges"
  },
  {
    id: 9,
    text: "Thinking or memory issues?",
    type: "multi",
    options: ["Memory", "Attention", "Planning", "Multi-tasking", "None"],
    field: "cognitiveIssues"
  },
  {
    id: 10,
    text: "Emotional state?",
    type: "multi",
    options: ["Anxious", "Depressed", "Irritable", "Motivated", "None"],
    field: "emotionalState"
  },
  {
    id: 11,
    text: "Sleep quality?",
    type: "select",
    options: ["Poor", "Interrupted", "Good"],
    field: "sleepQuality"
  },
  {
    id: 12,
    text: "Pain locations?",
    type: "multi",
    options: ["Head", "Arm", "Leg", "Back", "None"],
    field: "painLocations"
  },
  {
    id: 13,
    text: "Changes in vision, hearing, or feeling?",
    type: "multi",
    options: ["Vision blur", "Ringing in ears (Tinnitus)", "Numbness", "Taste/smell", "None"],
    field: "sensoryChanges"
  },
  {
    id: 14,
    text: "Goals?",
    type: "multi",
    options: ["Walk independently", "Speak clearly", "Less fatigue", "Return to work/hobbies", "None"],
    field: "goals"
  },
  {
    id: 15,
    text: "Current therapies?",
    type: "multi",
    options: ["PT", "OT", "Speech", "Meds", "None"],
    field: "currentTherapies"
  },
  {
    id: 16,
    text: "Internal body issues (like temperature or digestion)?",
    type: "multi",
    options: ["Bowel or Bladder issues", "Feeling too hot or cold", "Fast heart rate/palpitations", "None"],
    field: "autonomicIssues"
  },
  {
    id: 17,
    text: "Sensitivity to your surroundings?",
    type: "multi",
    options: ["Bright lights", "Loud noises", "Crowded spaces", "Strong smells", "None"],
    field: "sensorySensitivities"
  },
  {
    id: 18,
    text: "Knowing where your arms/legs are without looking?",
    type: "select",
    options: ["I always know where they are", "I have to look to know for sure", "Arms feel heavy or 'not mine'", "Legs feel heavy or 'not mine'"],
    field: "bodyAwareness"
  }
];

const INITIAL_ANSWERS: UserAnswers = {
  mainChallenge: [],
  activityTolerance: "",
  symptoms: SYMPTOMS_LIST.map(s => ({ name: s, rating: 0 })),
  homeSupport: "",
  equipment: [],
  confidence: "",
  worrySymptoms: [],
  routineChallenges: [],
  cognitiveIssues: [],
  emotionalState: [],
  sleepQuality: "",
  painLocations: [],
  sensoryChanges: [],
  goals: [],
  currentTherapies: [],
  autonomicIssues: [],
  sensorySensitivities: [],
  bodyAwareness: ""
};

export default function App() {
  const [view, setView] = useState<'intro' | 'assessment' | 'roadmap'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(INITIAL_ANSWERS);

  const roadmap = useMemo(() => {
    if (view === 'roadmap') {
      return generateRoadmap(answers);
    }
    return null;
  }, [answers, view]);

  const handleStart = () => setView('assessment');

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setView('roadmap');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setView('intro');
    }
  };

  const updateAnswer = (field: string, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: keyof UserAnswers, option: string) => {
    const currentValues = answers[field] as string[];
    if (currentValues.includes(option)) {
      updateAnswer(field, currentValues.filter(v => v !== option));
    } else {
      updateAnswer(field, [...currentValues, option]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent rounded-full text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Professional Recovery Support
              </div>
              <h1 className="text-6xl md:text-8xl font-sans font-bold tracking-tight text-theme-accent leading-[0.9]">
                The Neuro<br/><span className="text-theme-text opacity-20">Recovery Roadmap</span>
              </h1>
              <p className="text-xl text-theme-muted font-medium max-w-2xl mx-auto leading-relaxed">
                A data-driven assessment designed to rebuild your neuro-foundations through personalized sequencing and daily primitives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { icon: <Activity size={24} />, title: "15 Key Metrics", desc: "Symptom profiling" },
                { icon: <Wind size={24} />, title: "Daily Primitives", desc: "Neuro-anchors" },
                { icon: <Stethoscope size={24} />, title: "Chapter Guide", desc: "Personalized focus" }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-theme-border shadow-sm text-left space-y-3">
                  <div className="text-theme-accent">{feature.icon}</div>
                  <h3 className="font-bold text-theme-text">{feature.title}</h3>
                  <p className="text-sm text-theme-muted">{feature.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="h-20 px-16 rounded-full bg-theme-accent text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-6 text-xl"
            >
              Start Assessment
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}

        {view === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto space-y-8 py-8 md:py-16"
          >
            <div className="flex justify-between items-center px-4">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-theme-muted hover:text-theme-accent transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <div className="flex flex-col items-center gap-1">
                 <div className="text-[10px] font-black text-theme-muted tracking-[0.3em] uppercase">
                  Step {currentQuestionIndex + 1} / {QUESTIONS.length}
                </div>
                <div className="w-32 h-1 bg-theme-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-theme-accent transition-all duration-700 ease-out" 
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-theme-border flex items-center justify-center text-xs font-black text-theme-muted">
                {Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%
              </div>
            </div>

            <QuestionCard 
              question={QUESTIONS[currentQuestionIndex]} 
              answers={answers} 
              onUpdate={updateAnswer}
              onToggleMulti={toggleMultiSelect}
              onNext={handleNext}
            />

            <div className="px-4">
              <button
                onClick={handleNext}
                disabled={!isQuestionAnswered(QUESTIONS[currentQuestionIndex], answers)}
                className="w-full h-20 rounded-[2rem] bg-theme-accent text-white font-black text-xl disabled:opacity-20 transition-all flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
              >
                {currentQuestionIndex === QUESTIONS.length - 1 ? "Generate My Roadmap" : "Continue"}
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}

        {view === 'roadmap' && roadmap && (
          <RoadmapDisplay 
            roadmap={roadmap} 
            onReset={() => {
              setAnswers(INITIAL_ANSWERS);
              setCurrentQuestionIndex(0);
              setView('intro');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function isQuestionAnswered(question: any, answers: any) {
  const value = answers[question.field];
  if (question.type === 'select') return value !== "";
  if (question.type === 'multi') return value.length > 0;
  if (question.type === 'rating_list') return true;
  return false;
}

function QuestionCard({ question, answers, onUpdate, onToggleMulti, onNext }: any) {
  return (
    <div className="bg-white p-8 md:p-14 rounded-[3rem] border border-theme-border shadow-2xl space-y-10">
      <h2 className="text-3xl md:text-5xl font-sans font-bold text-theme-text leading-[1.1] tracking-tight">
        {question.text}
      </h2>

      <div className="space-y-4">
        {question.type === 'select' && (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  onUpdate(question.field, option);
                  onNext();
                }}
                className={`w-full p-6 text-left rounded-2xl border-2 transition-all font-bold text-lg flex justify-between items-center ${
                  answers[question.field] === option 
                    ? 'border-theme-accent bg-theme-accent/5 text-theme-accent' 
                    : 'border-theme-border hover:border-theme-accent/30 text-theme-text'
                }`}
              >
                {option}
                {answers[question.field] === option && <CheckCircle2 size={24} />}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option: string) => (
              <button
                key={option}
                onClick={() => onToggleMulti(question.field, option)}
                className={`w-full p-6 text-left rounded-2xl border-2 transition-all text-base font-bold ${
                  answers[question.field].includes(option)
                    ? 'border-theme-accent bg-theme-accent/5 text-theme-accent' 
                    : 'border-theme-border hover:border-theme-accent/30 text-theme-text'
                }`}
              >
                <div className="flex items-center justify-between">
                  {option}
                  {answers[question.field].includes(option) && <CheckCircle2 size={20} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === 'rating_list' && (
           <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-6 custom-scrollbar scroll-smooth">
             {question.options.map((symptom: string) => {
              const currentRating = answers.symptoms.find((s: SymptomRating) => s.name === symptom)?.rating || 0;
              return (
                <div key={symptom} className="space-y-4 group">
                  <div className="flex justify-between items-end px-1">
                    <span className="font-bold text-xl text-theme-text group-hover:text-theme-accent transition-colors">{symptom}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      currentRating === 3 ? 'bg-red-100 text-red-600' : 
                      currentRating === 2 ? 'bg-orange-100 text-orange-600' :
                      currentRating === 1 ? 'bg-blue-100 text-blue-600' :
                      'bg-theme-bg text-theme-muted'
                    }`}>
                      {['None', 'Mild', 'Mod', 'Severe'][currentRating]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newSymptoms = answers.symptoms.map((s: SymptomRating) => 
                            s.name === symptom ? { ...s, rating: num } : s
                          );
                          onUpdate('symptoms', newSymptoms);
                        }}
                        className={`py-4 rounded-xl border-2 transition-all text-sm font-black ${
                          currentRating === num
                            ? 'bg-theme-accent border-theme-accent text-white shadow-lg scale-105'
                            : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-accent/30'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapDisplay({ roadmap, onReset }: { roadmap: RecoveryRoadmap; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-12 pb-32"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} /> Analysis Complete
          </div>
           <h1 className="text-5xl md:text-7xl font-sans font-bold text-theme-accent leading-none">The Neuro<br/>Recovery Roadmap</h1>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-3 bg-white px-8 py-5 rounded-2xl border-2 border-theme-border text-sm font-black uppercase tracking-widest hover:border-theme-accent hover:text-theme-accent transition-all shadow-sm"
        >
          <RefreshCcw size={18} /> Re-Assess
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <section className="col-span-1 md:col-span-12 bg-white p-12 md:p-20 rounded-[4rem] border-2 border-theme-border shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-theme-accent/5 rounded-bl-[10rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
          <h2 className="text-theme-accent text-xs font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
             <TrendingUp size={24} /> Starting Focus
          </h2>
          <p className="text-3xl md:text-5xl font-sans font-bold text-theme-text leading-[1.1] max-w-5xl tracking-tight">
            {roadmap.starting_focus}
          </p>
          
          <div className="mt-12 flex flex-wrap gap-4">
            {roadmap.top_priorities.map((priority) => (
              <div key={priority.name} className="flex items-center gap-4 bg-theme-bg px-6 py-4 rounded-3xl border border-theme-border group hover:border-theme-accent transition-all shadow-sm">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-inner ${
                  priority.rating === 3 ? 'bg-red-500' :
                  priority.rating === 2 ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {priority.rating}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-0.5">Priority Score</div>
                  <div className="text-lg font-bold text-theme-text leading-none">{priority.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-1 md:col-span-7 space-y-8">
          <h3 className="text-xs uppercase tracking-[0.4em] font-black text-theme-muted flex items-center gap-3 ml-4">
            <BookOpen size={20} /> Priority Foundations
          </h3>
          <div className="space-y-6">
            {roadmap.recommended_chapters.map((chapter, i) => (
              <motion.div 
                key={chapter.chapter} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white border-2 border-theme-border p-10 rounded-[3rem] group hover:border-theme-accent transition-all hover:shadow-xl"
              >
                <div className="flex gap-8 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-3xl bg-theme-bg flex items-center justify-center text-2xl text-theme-accent font-black group-hover:bg-theme-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                    0{i + 1}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-theme-text tracking-tight">{chapter.chapter}</h4>
                    <p className="text-lg text-theme-muted leading-relaxed font-medium">{chapter.focus}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="col-span-1 md:col-span-5 h-full">
          <div className="bg-theme-accent p-12 md:p-16 rounded-[4rem] text-white space-y-12 shadow-2xl sticky top-8 border-4 border-white/10">
            <div className="space-y-8">
              <h2 className="text-3xl font-black flex items-center gap-4 tracking-tight">
                <Calendar size={32} /> Weekly Rhythm
              </h2>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Movement Directives</p>
                  <p className="text-2xl font-bold leading-snug">{roadmap.weekly_rhythm.active_days}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Daily Stimulation (Passive)</p>
                  <p className="text-xl opacity-90 leading-relaxed font-semibold">{roadmap.weekly_rhythm.stimulation_days}</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/20">
              <div className="flex gap-4">
                <div className="text-4xl opacity-40 font-serif leading-none mt-2 flex-shrink-0">"</div>
                <p className="italic text-white opacity-90 font-serif text-2xl leading-relaxed">
                  {roadmap.weekly_rhythm.daily_note}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-12 rounded-[4rem] border-2 border-theme-border flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2.5xl bg-blue-50 text-blue-500 items-center justify-center flex">
              <Battery size={24} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-theme-muted mb-4">Equipment</h4>
              <p className="text-xl text-theme-text font-bold leading-tight">{roadmap.equipment_suggestion}</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] border-2 border-theme-border flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2.5xl bg-purple-50 text-purple-500 items-center justify-center flex">
              <RefreshCcw size={24} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-theme-muted mb-4">Next Steps</h4>
              <p className="text-xl text-theme-text font-bold leading-tight">{roadmap.next_steps}</p>
            </div>
          </div>

          <div className="bg-orange-50 p-12 rounded-[4rem] border-2 border-orange-100 flex flex-col gap-6">
             <div className="w-14 h-14 rounded-2.5xl bg-white text-orange-500 items-center justify-center flex shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-orange-700 mb-4">Core Cautions</h4>
              <ul className="space-y-4">
                {roadmap.cautions.length > 0 ? (
                  roadmap.cautions.map((c, i) => (
                    <li key={i} className="text-base text-orange-900 flex items-start gap-3 font-bold">
                      <span className="text-orange-400 mt-1 flex-shrink-0">●</span> {c}
                    </li>
                  ))
                ) : (
                  <li className="text-base text-orange-900 opacity-60 font-bold">Focus on quality over quantity. No specific high-risk flags identified.</li>
                )}
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
