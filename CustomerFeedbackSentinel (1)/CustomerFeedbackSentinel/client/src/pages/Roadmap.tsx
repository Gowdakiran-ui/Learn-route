import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { RoadmapForm } from "@/components/RoadmapForm";
import { useQuery } from "@tanstack/react-query";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Separator } from "@/components/ui/separator";
import { Roadmap as RoadmapType, RoadmapStep, Resource } from "@shared/schema";

export default function Roadmap() {
  const [activeTab, setActiveTab] = useState("active");
  const [showFormModal, setShowFormModal] = useState(false);
  
  // For demo purposes, we're using a hardcoded user ID
  const userId = 1;

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/roadmaps`],
    // We use the queryFn configured in queryClient.ts
  });

  const { data: activeRoadmap } = useQuery({
    queryKey: ['/api/roadmaps/1'],
    enabled: roadmaps ? roadmaps.length > 0 : false,
  });

  const { data: resources } = useQuery({
    queryKey: ['/api/resources/multiple'],
    queryFn: async () => {
      if (!activeRoadmap) return [];
      
      const resourceIds = (activeRoadmap.steps as RoadmapStep[])
        .flatMap(step => step.resourceIds);
      
      if (resourceIds.length === 0) return [];
      
      const response = await fetch('/api/resources/multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: resourceIds }),
        credentials: 'include',
      });
      
      return response.json();
    },
    enabled: !!activeRoadmap,
  });

  const toggleFormModal = () => {
    setShowFormModal(!showFormModal);
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Your Learning Progress
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Track your educational journey and stay on the path to mastery.
          </motion.p>
        </div>
        <motion.div 
          className="mt-4 md:mt-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button onClick={toggleFormModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Roadmap
          </Button>
        </motion.div>
      </div>

      <Tabs 
        defaultValue="active" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="active">Active Roadmaps</TabsTrigger>
          <TabsTrigger value="completed">Completed Roadmaps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : roadmaps && roadmaps.length > 0 ? (
            <>
              {/* Current Progress Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Current Progress</CardTitle>
                    <CardDescription>
                      {activeRoadmap ? activeRoadmap.title : 'Your active learning roadmap'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <ProgressRing 
                          progress={activeRoadmap ? activeRoadmap.progress : 0} 
                          size={160} 
                          strokeWidth={12}
                          color="hsl(var(--primary))"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-4">
                          {activeRoadmap ? activeRoadmap.title : 'Web Development Fundamentals'}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Category</div>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {activeRoadmap ? activeRoadmap.category : 'web-development'}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Created</div>
                            <div className="text-sm text-muted-foreground">
                              {activeRoadmap ? new Date(activeRoadmap.createdAt).toLocaleDateString() : 'May 5, 2025'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Steps Completed</div>
                            <div className="text-sm">
                              {activeRoadmap ? 
                                `${(activeRoadmap.steps as RoadmapStep[]).filter(step => step.completed).length} of ${(activeRoadmap.steps as RoadmapStep[]).length}` : 
                                '3 of 8'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Roadmap Steps */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Roadmap Steps</CardTitle>
                    <CardDescription>Follow these steps to master your skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {activeRoadmap ? (
                        (activeRoadmap.steps as RoadmapStep[]).map((step, index) => (
                          <div key={step.id} className="relative">
                            {index > 0 && (
                              <div className="absolute left-6 top-0 -mt-8 h-8 w-px bg-border"></div>
                            )}
                            <div className="flex items-start gap-4">
                              <div className={`mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full ${step.completed ? 'bg-primary' : 'bg-muted'}`}>
                                {step.completed ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                ) : (
                                  <span className="text-foreground">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold">{step.title}</h3>
                                  <Button 
                                    variant={step.completed ? "outline" : "default"} 
                                    size="sm"
                                    onClick={async () => {
                                      await fetch(`/api/roadmaps/${activeRoadmap.id}/steps/${step.id}`, {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ completed: !step.completed }),
                                        credentials: 'include',
                                      });
                                      // Invalidate the roadmap query to update the UI
                                      // This is normally handled by the queryClient.invalidateQueries but this is a simpler approach
                                      window.location.reload();
                                    }}
                                  >
                                    {step.completed ? "Mark Incomplete" : "Mark Complete"}
                                  </Button>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                                
                                {/* Related Resources */}
                                {resources && resources.length > 0 && step.resourceIds.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-medium">Resources:</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                      {step.resourceIds.map(resourceId => {
                                        const resource = resources.find((r: Resource) => r.id === resourceId);
                                        if (!resource) return null;
                                        
                                        return (
                                          <a 
                                            key={resource.id}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-2 rounded-md bg-card/50 hover:bg-card transition-colors"
                                          >
                                            {resource.type === "video" ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                              </svg>
                                            ) : (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                                                <polyline points="10 2 10 10 13 7 16 10 16 2"></polyline>
                                              </svg>
                                            )}
                                            <span className="text-sm">{resource.title}</span>
                                            <span className="text-xs text-muted-foreground ml-auto">{resource.duration}</span>
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {index < (activeRoadmap.steps as RoadmapStep[]).length - 1 && (
                              <div className="absolute left-6 bottom-0 h-full w-px bg-border"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Select a roadmap to view its steps
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">No Active Roadmaps</h3>
              <p className="text-muted-foreground mb-6 max-w-md">You haven't created any learning roadmaps yet. Start by creating a personalized learning path.</p>
              <Button onClick={toggleFormModal}>Create Your First Roadmap</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Completed Roadmaps</h3>
            <p className="text-muted-foreground mb-6 max-w-md">You haven't completed any learning roadmaps yet. Keep learning and you'll get there!</p>
            <Button variant="outline" onClick={() => setActiveTab("active")}>View Active Roadmaps</Button>
          </div>
        </TabsContent>
      </Tabs>

      {showFormModal && (
        <RoadmapForm onClose={toggleFormModal} userId={userId} />
      )}
    </motion.div>
  );
}
