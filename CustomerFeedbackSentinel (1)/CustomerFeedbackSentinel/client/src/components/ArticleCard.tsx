import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Resource } from "@shared/schema";

interface ArticleCardProps {
  resource: Resource;
}

export function ArticleCard({ resource }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
      <div className="relative">
        <img 
          src={resource.thumbnail || `https://via.placeholder.com/300x200?text=${resource.title.replace(/\s+/g, '+')}`} 
          alt={resource.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-blue-600 text-white border-blue-700/20">
            Article
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm border-border/20">
            {resource.duration}
          </Badge>
        </div>
      </div>
      <CardContent className="py-4 flex-1">
        <h3 className="font-medium mb-2 line-clamp-1">{resource.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            Read Article
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
