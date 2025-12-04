import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomPrograms } from '@/hooks/useCustomPrograms';
import { Plus } from 'lucide-react';

interface CreateProgramSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProgramSheet({ open, onOpenChange }: CreateProgramSheetProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const { createProgram } = useCustomPrograms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    await createProgram.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
      days_per_week: daysPerWeek,
    });

    setName('');
    setDescription('');
    setDaysPerWeek(3);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 uppercase font-bold">
            <Plus className="h-5 w-5" />
            Create Program
          </SheetTitle>
          <SheetDescription>
            Create a custom workout program tailored to your goals.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase text-xs font-bold">
              Program Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Custom Split"
              className="border-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="uppercase text-xs font-bold">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your program..."
              className="border-2 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days" className="uppercase text-xs font-bold">
              Days Per Week
            </Label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDaysPerWeek(days)}
                  className={`flex-1 py-2 border-2 border-border font-bold transition-all ${
                    daysPerWeek === days
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full uppercase font-bold"
            disabled={!name.trim() || createProgram.isPending}
          >
            {createProgram.isPending ? 'Creating...' : 'Create Program'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
