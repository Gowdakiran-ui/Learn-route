import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  }
];

export default function DailyWonder() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setFadeIn(true);
    
    // Set up quote rotation every 24 hours
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(newQuote);
        setFadeIn(true);
      }, 500);
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Daily Wonder
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80" 
            alt="Sunset mountain landscape" 
            className="rounded-md w-full h-full object-cover"
          />
        </div>
        <div className={`col-span-1 md:col-span-2 flex flex-col justify-center transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          {quote && (
            <>
              <p className="text-lg md:text-xl font-medium mb-2">"{quote.text}"</p>
              <p className="text-sm text-muted-foreground">— {quote.author}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
