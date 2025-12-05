import { useState, useCallback } from "react";
import { ProgramType, Workout } from "@/types/workout";
import { workoutPrograms } from "@/data/workouts";
import { ProgramSelector } from "@/components/ProgramSelector";
import { EquipmentManager } from "@/components/EquipmentManager";
import { WorkoutList } from "@/components/WorkoutList";
import { ExerciseLogger } from "@/components/ExerciseLogger";
import { WorkoutHistory } from "@/components/WorkoutHistory";
import { WorkoutActivityCalendar } from "@/components/WorkoutActivityCalendar";
import { MuscleBodyDiagram } from "@/components/MuscleBody/MuscleBodyDiagram";
import { MuscleHighlightProvider } from "@/context/MuscleHighlightContext";
import { WorkoutCustomizer } from "@/components/WorkoutCustomizer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeightProgressionChart } from "@/components/Analytics/WeightProgressionChart";
import { useWorkoutAnalytics } from "@/hooks/useWorkoutAnalytics";
import { NeuCard } from "@/components/ui/neu-card";
import { Dumbbell, TrendingUp } from "lucide-react";

type WorkoutStep = 'browse' | 'customize' | 'logging';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
  const [selectedCustomProgram, setSelectedCustomProgram] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workoutStep, setWorkoutStep] = useState<WorkoutStep>('browse');
  const [historyKey, setHistoryKey] = useState(0);

  const { data: analyticsData, isLoading: analyticsLoading } = useWorkoutAnalytics(730);

  const handleWorkoutComplete = useCallback(() => {
    setHistoryKey((k) => k + 1);
  }, []);

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setWorkoutStep('customize');
  };

  const handleStartWorkout = (customizedWorkout: Workout) => {
    setActiveWorkout(customizedWorkout);
    setWorkoutStep('logging');
  };

  const handleBackFromCustomize = () => {
    setSelectedWorkout(null);
    setWorkoutStep('browse');
  };

  const handleBackFromLogging = () => {
    setActiveWorkout(null);
    setSelectedWorkout(null);
    setWorkoutStep('browse');
  };

  // Customize screen
  if (workoutStep === 'customize' && selectedWorkout) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8 px-4">
          <WorkoutCustomizer
            workout={selectedWorkout}
            onBack={handleBackFromCustomize}
            onStart={handleStartWorkout}
          />
        </div>
      </main>
    );
  }

  // Logging screen
  if (workoutStep === 'logging' && activeWorkout) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8 px-4">
          <ExerciseLogger 
            workout={activeWorkout} 
            onBack={handleBackFromLogging} 
            onWorkoutComplete={handleWorkoutComplete}
          />
        </div>
      </main>
    );
  }

  return (
    <MuscleHighlightProvider>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b-4 border-border bg-secondary">
          <div className="container max-w-6xl py-6 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 border-2 border-border shadow-sm">
                  <Dumbbell className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                    GymForge
                  </h1>
                  <p className="text-muted-foreground font-mono text-sm">
                    Track • Train • Transform
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="container max-w-6xl py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1 space-y-12">
              <ProgramSelector
                selectedProgram={selectedProgram}
                onSelectProgram={setSelectedProgram}
                selectedCustomProgram={selectedCustomProgram}
                onSelectCustomProgram={setSelectedCustomProgram}
              />

              {selectedProgram && !selectedCustomProgram && (
                <WorkoutList
                  workouts={workoutPrograms}
                  programType={selectedProgram}
                  onSelectWorkout={handleSelectWorkout}
                />
              )}

              {/* Weight Progression Chart */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="h-6 w-6" />
                    Weight Progression
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    Track your strength gains over time
                  </p>
                </div>
                <NeuCard variant="flat" className="p-4">
                  {analyticsLoading ? (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground font-mono">
                      Loading...
                    </div>
                  ) : (
                    <WeightProgressionChart data={analyticsData?.weightProgression || []} />
                  )}
                </NeuCard>
              </section>

              <WorkoutHistory key={historyKey} />

              <EquipmentManager />
            </div>

            {/* Right Column - Activity Calendar & Muscle Status */}
            <div className="lg:w-72 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-8 space-y-6">
                <WorkoutActivityCalendar />
                <MuscleBodyDiagram />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-4 border-border bg-secondary mt-12">
          <div className="container max-w-6xl py-6 px-4">
            <p className="text-center text-muted-foreground font-mono text-xs uppercase">
              Built for gains • No excuses
            </p>
          </div>
        </footer>
      </main>
    </MuscleHighlightProvider>
  );
};

export default Index;