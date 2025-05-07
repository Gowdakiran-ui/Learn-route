import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateRoadmap } from "@/lib/roadmapData";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  currentSkills: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).min(1, { message: "Please select at least one learning goal." }),
});

interface RoadmapFormProps {
  onClose: () => void;
  userId: number;
}

export function RoadmapForm({ onClose, userId }: RoadmapFormProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skills and goals options
  const skillOptions = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "react", label: "React" },
    { id: "angular", label: "Angular" },
    { id: "vue", label: "Vue.js" },
    { id: "node", label: "Node.js" },
    { id: "express", label: "Express.js" },
    { id: "sql", label: "SQL" },
    { id: "mongodb", label: "MongoDB" },
  ];

  const goalOptions = [
    { id: "web-dev", label: "Web Development" },
    { id: "mobile-dev", label: "Mobile Development" },
    { id: "backend", label: "Backend Development" },
    { id: "frontend", label: "Frontend Development" },
    { id: "fullstack", label: "Full Stack Development" },
    { id: "data-science", label: "Data Science" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "devops", label: "DevOps" },
    { id: "cloud", label: "Cloud Computing" },
    { id: "blockchain", label: "Blockchain" },
  ];

  const categories = [
    { id: "web-development", label: "Web Development" },
    { id: "mobile-development", label: "Mobile Development" },
    { id: "data-science", label: "Data Science" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "devops", label: "DevOps" },
    { id: "cloud-computing", label: "Cloud Computing" },
    { id: "blockchain", label: "Blockchain" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      currentSkills: [],
      learningGoals: [],
    },
  });

  function nextStep() {
    // Validate current step fields before proceeding
    if (step === 1) {
      const titleValid = form.trigger("title");
      const descriptionValid = form.trigger("description");
      const categoryValid = form.trigger("category");
      
      if (titleValid && descriptionValid && categoryValid) {
        setStep(2);
      }
    }
  }

  function prevStep() {
    setStep(1);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Generate a roadmap based on the form values
      const roadmapSteps = generateRoadmap(values.category);
      
      // Prepare the roadmap data for submission
      const roadmapData = {
        userId,
        title: values.title,
        description: values.description,
        category: values.category,
        progress: 0,
        steps: roadmapSteps,
        createdAt: new Date().toISOString(),
      };
      
      // Submit the roadmap to the API
      await apiRequest("POST", "/api/roadmaps", roadmapData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/roadmaps`] });
      
      // Show success message
      toast({
        title: "Roadmap Created!",
        description: "Your learning roadmap has been successfully created.",
      });
      
      // Close the form
      onClose();
    } catch (error) {
      console.error("Error creating roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to create roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Learning Roadmap</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Define your learning roadmap basics."
              : "Tell us about your skills and goals."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roadmap Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe what you want to learn..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="currentSkills"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Current Skills (Optional)</FormLabel>
                        <FormDescription>
                          Select any skills you already know.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {skillOptions.map((skill) => (
                          <FormField
                            key={skill.id}
                            control={form.control}
                            name="currentSkills"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={skill.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, skill.id]);
                                        } else {
                                          field.onChange(
                                            currentValue.filter((value) => value !== skill.id)
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {skill.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="learningGoals"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Learning Goals</FormLabel>
                        <FormDescription>
                          Select what you want to learn.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {goalOptions.map((goal) => (
                          <FormField
                            key={goal.id}
                            control={form.control}
                            name="learningGoals"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={goal.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(goal.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, goal.id]);
                                        } else {
                                          field.onChange(
                                            currentValue.filter((value) => value !== goal.id)
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {goal.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <DialogFooter>
              {step === 1 ? (
                <Button type="button" onClick={nextStep}>Next</Button>
              ) : (
                <div className="flex gap-2 justify-end w-full">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Roadmap"
                    )}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
