import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddWorkoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; dayLabel: string; description: string }) => void;
}

export function AddWorkoutSheet({ open, onOpenChange, onSubmit }: AddWorkoutSheetProps) {
  const [title, setTitle] = useState("");
  const [dayLabel, setDayLabel] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({ 
      title: title.trim(), 
      dayLabel: dayLabel.trim(), 
      description: description.trim() 
    });
    
    // Reset form
    setTitle("");
    setDayLabel("");
    setDescription("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold uppercase">Add Workout</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Workout Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Push Day, Leg Day"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayLabel">Day Label</Label>
            <Input
              id="dayLabel"
              placeholder="e.g., Day 1, Monday"
              value={dayLabel}
              onChange={(e) => setDayLabel(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this workout..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <NeuButton 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full h-12"
            disabled={!title.trim()}
          >
            Create Workout
          </NeuButton>
        </form>
      </SheetContent>
    </Sheet>
  );
}