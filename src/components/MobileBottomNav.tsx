import { Home, Dumbbell, History, Wrench, ChevronUp } from "lucide-react";

interface MobileBottomNavProps {
  onQuickWorkout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function MobileBottomNav({ onQuickWorkout, onToggleSidebar, sidebarOpen }: MobileBottomNavProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-secondary border-t-4 border-border">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => scrollTo('programs-section')}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-mono uppercase">Home</span>
        </button>
        
        <button
          onClick={onQuickWorkout}
          className="flex flex-col items-center gap-1 p-2 text-primary"
        >
          <div className="bg-primary text-primary-foreground p-2 border-2 border-border">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono uppercase font-bold">Workout</span>
        </button>
        
        <button
          onClick={() => scrollTo('history-section')}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <History className="h-5 w-5" />
          <span className="text-xs font-mono uppercase">History</span>
        </button>
        
        <button
          onClick={() => scrollTo('equipment-section')}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Wrench className="h-5 w-5" />
          <span className="text-xs font-mono uppercase">Equipment</span>
        </button>

        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronUp className={`h-5 w-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          <span className="text-xs font-mono uppercase">Stats</span>
        </button>
      </div>
    </nav>
  );
}
