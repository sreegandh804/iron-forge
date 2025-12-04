import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type HighlightMode = 'recovery' | 'program' | 'exercise' | 'clicked';

export interface HighlightedMuscle {
  name: string;
  isPrimary: boolean;
}

interface MuscleHighlightContextType {
  highlightedMuscles: HighlightedMuscle[];
  highlightMode: HighlightMode;
  clickedMuscle: string | null;
  setHighlightedMuscles: (muscles: HighlightedMuscle[]) => void;
  setHighlightMode: (mode: HighlightMode) => void;
  setClickedMuscle: (muscle: string | null) => void;
  highlightProgramMuscles: (muscles: string[]) => void;
  highlightExerciseMuscles: (primary: string[], secondary: string[]) => void;
  clearHighlight: () => void;
}

const MuscleHighlightContext = createContext<MuscleHighlightContextType | undefined>(undefined);

export const MuscleHighlightProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedMuscles, setHighlightedMuscles] = useState<HighlightedMuscle[]>([]);
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('recovery');
  const [clickedMuscle, setClickedMuscle] = useState<string | null>(null);

  const highlightProgramMuscles = useCallback((muscles: string[]) => {
    setHighlightMode('program');
    setHighlightedMuscles(muscles.map(name => ({ name, isPrimary: true })));
  }, []);

  const highlightExerciseMuscles = useCallback((primary: string[], secondary: string[]) => {
    setHighlightMode('exercise');
    setHighlightedMuscles([
      ...primary.map(name => ({ name, isPrimary: true })),
      ...secondary.map(name => ({ name, isPrimary: false }))
    ]);
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightMode('recovery');
    setHighlightedMuscles([]);
    setClickedMuscle(null);
  }, []);

  return (
    <MuscleHighlightContext.Provider
      value={{
        highlightedMuscles,
        highlightMode,
        clickedMuscle,
        setHighlightedMuscles,
        setHighlightMode,
        setClickedMuscle,
        highlightProgramMuscles,
        highlightExerciseMuscles,
        clearHighlight
      }}
    >
      {children}
    </MuscleHighlightContext.Provider>
  );
};

export const useMuscleHighlight = () => {
  const context = useContext(MuscleHighlightContext);
  if (context === undefined) {
    throw new Error('useMuscleHighlight must be used within a MuscleHighlightProvider');
  }
  return context;
};
