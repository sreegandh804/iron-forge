import { useState, useEffect } from "react";
import { ProgramType, Equipment, Workout } from "@/types/workout";
import { defaultEquipment, workoutPrograms } from "@/data/workouts";
import { ProgramSelector } from "@/components/ProgramSelector";
import { EquipmentManager } from "@/components/EquipmentManager";
import { WorkoutList } from "@/components/WorkoutList";
import { ExerciseLogger } from "@/components/ExerciseLogger";
import { Dumbbell } from "lucide-react";

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem("gym-equipment");
    return saved ? JSON.parse(saved) : defaultEquipment;
  });
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    localStorage.setItem("gym-equipment", JSON.stringify(equipment));
  }, [equipment]);

  const handleAddEquipment = (newEquipment: Equipment) => {
    setEquipment([...equipment, newEquipment]);
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment(equipment.filter((e) => e.id !== id));
  };

  if (activeWorkout) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <ExerciseLogger workout={activeWorkout} onBack={() => setActiveWorkout(null)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-border bg-secondary">
        <div className="container max-w-4xl py-6 px-4">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl py-8 px-4 space-y-12">
        <ProgramSelector
          selectedProgram={selectedProgram}
          onSelectProgram={setSelectedProgram}
        />

        {selectedProgram && (
          <WorkoutList
            workouts={workoutPrograms}
            programType={selectedProgram}
            onSelectWorkout={setActiveWorkout}
          />
        )}

        <EquipmentManager
          equipment={equipment}
          onAddEquipment={handleAddEquipment}
          onRemoveEquipment={handleRemoveEquipment}
        />
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-border bg-secondary mt-12">
        <div className="container max-w-4xl py-6 px-4">
          <p className="text-center text-muted-foreground font-mono text-xs uppercase">
            Built for gains • No excuses
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
