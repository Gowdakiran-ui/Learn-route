import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ProgressCardProps {
  title: string;
  progress: number;
  icon: ReactNode;
  className?: string;
}

export default function ProgressCard({ title, progress, icon, className }: ProgressCardProps) {
  return (
    <Card className={cn("h-full transition-all hover:shadow-md hover:-translate-y-1", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <h3 className="flex items-center text-xl font-semibold mb-4">
            <span className="mr-2 text-primary">{icon}</span>
            {title}
          </h3>
          
          <ProgressRing 
            progress={progress} 
            size={120} 
            strokeWidth={10}
            className="mb-2"
            color="hsl(var(--primary))"
          />
          
          <p className="text-sm text-muted-foreground mt-2">
            {progress === 0 ? (
              "Start your learning journey"
            ) : progress < 25 ? (
              "Just getting started"
            ) : progress < 50 ? (
              "Building momentum"
            ) : progress < 75 ? (
              "Making great progress"
            ) : progress < 100 ? (
              "Almost there!"
            ) : (
              "Completed!"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
