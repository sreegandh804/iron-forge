import { ProgramType } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { Dumbbell, Repeat, ArrowUpDown } from "lucide-react";

interface ProgramSelectorProps {
  selectedProgram: ProgramType | null;
  onSelectProgram: (program: ProgramType) => void;
}

const programs = [
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

export function ProgramSelector({ selectedProgram, onSelectProgram }: ProgramSelectorProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Select Program</h2>
        <p className="text-muted-foreground font-mono text-sm">Choose your training split</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {programs.map((program) => {
          const Icon = program.icon;
          const isSelected = selectedProgram === program.type;
          
          return (
            <NeuCard
              key={program.type}
              variant={isSelected ? "pressed" : "raised"}
              className={`cursor-pointer ${program.accent} ${
                isSelected ? "bg-accent" : ""
              }`}
              onClick={() => onSelectProgram(program.type)}
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
    </section>
  );
}
