import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LearningCardProps {
  type: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  progress?: number;
  isNew?: boolean;
  onClick?: () => void;
}

export default function LearningCard({
  type,
  title,
  description,
  image,
  duration,
  progress,
  isNew,
  onClick
}: LearningCardProps) {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 left-0 p-3 flex items-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium flex items-center">
            {type === "TUTORIAL" && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                <polyline points="10 2 10 10 13 7 16 10 16 2"></polyline>
              </svg>
            )}
            {type === "COURSE" && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            )}
            {type === "WORKSHOP" && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            )}
            <span className="text-primary">{type}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">{duration}</div>
          {typeof progress === "number" ? (
            <div className="w-16">
              <Progress value={progress} className="h-1.5" />
            </div>
          ) : isNew ? (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0">
              New
            </Badge>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
