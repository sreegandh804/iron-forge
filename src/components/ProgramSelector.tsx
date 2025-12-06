import { useState } from "react";
import { ProgramType } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { Dumbbell, Repeat, ArrowUpDown, Plus, Trash2, User, Zap } from "lucide-react";
import { useCustomPrograms, CustomProgram } from "@/hooks/useCustomPrograms";
import { CreateProgramSheet } from "./CreateProgramSheet";
import { Button } from "@/components/ui/button";
import { NeuButton } from "@/components/ui/neu-button";

interface ProgramSelectorProps {
  selectedProgram: ProgramType | null;
  onSelectProgram: (program: ProgramType) => void;
  selectedCustomProgram?: string | null;
  onSelectCustomProgram?: (programId: string) => void;
  onStartQuickWorkout?: () => void;
}

const defaultPrograms = [
  {
    type: "full-body" as ProgramType,
    title: "FULL BODY",
    description: "3 days/week • Hit every muscle each session",
    icon: Dumbbell,
    accent: "border-l-8 border-l-[hsl(var(--program-full-body))]",
  },
  {
    type: "ppl" as ProgramType,
    title: "PUSH PULL LEGS",
    description: "6 days/week • Split by movement pattern",
    icon: Repeat,
    accent: "border-l-8 border-l-[hsl(var(--program-ppl))]",
  },
  {
    type: "upper-lower" as ProgramType,
    title: "UPPER / LOWER",
    description: "4 days/week • Alternate upper and lower",
    icon: ArrowUpDown,
    accent: "border-l-8 border-l-[hsl(var(--program-upper-lower))]",
  },
];

export function ProgramSelector({ 
  selectedProgram, 
  onSelectProgram,
  selectedCustomProgram,
  onSelectCustomProgram,
  onStartQuickWorkout
}: ProgramSelectorProps) {
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const { programs: customPrograms, deleteProgram, isLoading } = useCustomPrograms();

  const handleSelectDefault = (program: ProgramType) => {
    onSelectProgram(program);
    onSelectCustomProgram?.(null as any);
  };

  const handleSelectCustom = (programId: string) => {
    onSelectCustomProgram?.(programId);
  };

  const handleDeleteProgram = (e: React.MouseEvent, programId: string) => {
    e.stopPropagation();
    deleteProgram.mutate(programId);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Select Program</h2>
          <p className="text-muted-foreground font-mono text-sm">Choose your training split</p>
        </div>
        <div className="flex gap-2">
          <NeuButton
            variant="default"
            size="sm"
            onClick={onStartQuickWorkout}
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Workout
          </NeuButton>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-2"
            onClick={() => setCreateSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        </div>
      </div>
      
      {/* Default Programs */}
      <div className="grid gap-4 md:grid-cols-3">
        {defaultPrograms.map((program) => {
          const Icon = program.icon;
          const isSelected = selectedProgram === program.type && !selectedCustomProgram;
          
          return (
            <NeuCard
              key={program.type}
              variant={isSelected ? "pressed" : "raised"}
              className={`cursor-pointer ${program.accent} ${
                isSelected ? "bg-accent" : ""
              }`}
              onClick={() => handleSelectDefault(program.type)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8" strokeWidth={2.5} />
                  {isSelected && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-bold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{program.title}</h3>
                  <p className="text-muted-foreground font-mono text-xs mt-1">
                    {program.description}
                  </p>
                </div>
              </div>
            </NeuCard>
          );
        })}
      </div>

      {/* Custom Programs */}
      {customPrograms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Programs
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {customPrograms.map((program) => {
              const isSelected = selectedCustomProgram === program.id;
              
              return (
                <NeuCard
                  key={program.id}
                  variant={isSelected ? "pressed" : "raised"}
                  className={`cursor-pointer border-l-8 border-l-primary ${
                    isSelected ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectCustom(program.id)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Dumbbell className="h-8 w-8" strokeWidth={2.5} />
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-bold uppercase">
                            Active
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeleteProgram(e, program.id)}
                          className="p-1 hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase">{program.name}</h3>
                      <p className="text-muted-foreground font-mono text-xs mt-1">
                        {program.days_per_week} days/week
                        {program.description && ` • ${program.description}`}
                      </p>
                    </div>
                  </div>
                </NeuCard>
              );
            })}
          </div>
        </div>
      )}

      <CreateProgramSheet open={createSheetOpen} onOpenChange={setCreateSheetOpen} />
    </section>
  );
}
