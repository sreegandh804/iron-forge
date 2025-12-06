import { useState, useCallback, useMemo } from "react";
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
import { useEquipment } from "@/hooks/useEquipment";
import { useAuth } from "@/hooks/useAuth";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Dumbbell, TrendingUp, ChevronDown, LogOut } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

type WorkoutStep = 'browse' | 'customize' | 'logging';

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
  const [selectedCustomProgram, setSelectedCustomProgram] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workoutStep, setWorkoutStep] = useState<WorkoutStep>('browse');
  const [historyKey, setHistoryKey] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: analyticsData, isLoading: analyticsLoading } = useWorkoutAnalytics(730);
  const { equipment } = useEquipment();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    }
  };

  // Get IDs of available equipment
  const availableEquipmentIds = useMemo(() => {
    return equipment.filter(eq => eq.isAvailable).map(eq => eq.id);
  }, [equipment]);

  // Handle Quick Workout - start with empty exercise list
  const handleStartQuickWorkout = () => {
    const quickWorkout: Workout = {
      id: 'quick-workout-' + Date.now(),
      title: 'Quick Workout',
      description: 'Custom workout session',
      programType: 'custom',
      exercises: [],
    };
    setSelectedWorkout(quickWorkout);
    setWorkoutStep('customize');
  };

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
      <main className="min-h-screen bg-background pb-20 lg:pb-0">
        <div className="container max-w-6xl py-8 px-4">
          <WorkoutCustomizer
            workout={selectedWorkout}
            onBack={handleBackFromCustomize}
            onStart={handleStartWorkout}
          />
        </div>
        <MobileBottomNav 
          onQuickWorkout={handleStartQuickWorkout}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          sidebarOpen={mobileSidebarOpen}
        />
      </main>
    );
  }

  // Logging screen
  if (workoutStep === 'logging' && activeWorkout) {
    return (
      <main className="min-h-screen bg-background pb-20 lg:pb-0">
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
      <main className="min-h-screen bg-background pb-20 lg:pb-0">
        {/* Header */}
        <header className="border-b-4 border-border bg-secondary">
          <div className="container max-w-6xl py-4 sm:py-6 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary text-primary-foreground p-2 sm:p-3 border-2 border-border shadow-sm">
                  <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight">
                    GymForge
                  </h1>
                  <p className="text-muted-foreground font-mono text-xs sm:text-sm">
                    Track • Train • Transform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <NeuButton variant="outline" size="icon" onClick={handleSignOut} title="Sign out">
                  <LogOut className="h-4 w-4" />
                </NeuButton>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="container max-w-6xl py-6 sm:py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1 space-y-8 sm:space-y-12">
              <div id="programs-section">
                <ProgramSelector
                  selectedProgram={selectedProgram}
                  onSelectProgram={setSelectedProgram}
                  selectedCustomProgram={selectedCustomProgram}
                  onSelectCustomProgram={setSelectedCustomProgram}
                  onStartQuickWorkout={handleStartQuickWorkout}
                />
              </div>

              {selectedProgram && !selectedCustomProgram && (
                <WorkoutList
                  workouts={workoutPrograms}
                  programType={selectedProgram}
                  onSelectWorkout={handleSelectWorkout}
                  availableEquipmentIds={availableEquipmentIds}
                />
              )}

              {/* Weight Progression Chart */}
              <section className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    Weight Progression
                  </h2>
                  <p className="text-muted-foreground font-mono text-xs sm:text-sm">
                    Track your strength gains over time
                  </p>
                </div>
                <NeuCard variant="flat" className="p-3 sm:p-4">
                  {analyticsLoading ? (
                    <div className="h-[200px] sm:h-[250px] flex items-center justify-center text-muted-foreground font-mono">
                      Loading...
                    </div>
                  ) : (
                    <WeightProgressionChart data={analyticsData?.weightProgression || []} />
                  )}
                </NeuCard>
              </section>

              <div id="history-section">
                <WorkoutHistory key={historyKey} />
              </div>

              <div id="equipment-section">
                <EquipmentManager />
              </div>
            </div>

            {/* Right Column - Activity Calendar & Muscle Status */}
            {/* Mobile: Collapsible, Desktop: Always visible */}
            <div className="lg:w-72 lg:flex-shrink-0">
              {/* Mobile Collapsible */}
              <div className="lg:hidden">
                <Collapsible open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <CollapsibleTrigger className="w-full">
                    <NeuCard variant="flat" className="flex items-center justify-between p-4">
                      <span className="font-bold uppercase text-sm">Stats & Recovery</span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${mobileSidebarOpen ? 'rotate-180' : ''}`} />
                    </NeuCard>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <WorkoutActivityCalendar />
                    <MuscleBodyDiagram />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Desktop Sticky */}
              <div className="hidden lg:block lg:sticky lg:top-8 space-y-6">
                <WorkoutActivityCalendar />
                <MuscleBodyDiagram />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-4 border-border bg-secondary mt-8 sm:mt-12 hidden lg:block">
          <div className="container max-w-6xl py-6 px-4">
            <p className="text-center text-muted-foreground font-mono text-xs uppercase">
              Built for gains • No excuses
            </p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          onQuickWorkout={handleStartQuickWorkout}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          sidebarOpen={mobileSidebarOpen}
        />
      </main>
    </MuscleHighlightProvider>
  );
};

export default Index;
