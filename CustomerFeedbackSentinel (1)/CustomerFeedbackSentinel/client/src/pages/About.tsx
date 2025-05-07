import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          About LearnRoute
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          LearnRoute is a personalized learning roadmap generator designed to help you navigate your educational journey efficiently.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us forward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At LearnRoute, our mission is to democratize education by providing personalized learning paths that are accessible to everyone, regardless of their background or current skill level.
              </p>
              <p>
                We believe that learning should be a journey tailored to individual needs, preferences, and goals. Our platform curates the best educational resources from across the web, organizing them into coherent, step-by-step roadmaps that guide learners from novice to expert.
              </p>
              <p>
                By combining cutting-edge technology with pedagogical best practices, we aim to revolutionize self-directed learning and empower individuals to master new skills efficiently.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The process behind LearnRoute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Input Your Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us what you want to learn and your current skill level.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Generate Your Roadmap</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system creates a personalized learning path with curated resources.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Mark steps as completed as you move through your journey.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Achieve Mastery</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your roadmap and become proficient in your chosen skill.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Creator Profile</CardTitle>
            <CardDescription>The talent behind LearnRoute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Kiran Gowda A</h3>
                <p className="text-sm text-muted-foreground mb-2">AI/ML Enthusiast | Tech Innovator | The GOAT of Website Creation</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">Machine Learning</Badge>
                  <Badge variant="secondary" className="text-xs">Deep Learning</Badge>
                  <Badge variant="secondary" className="text-xs">NLP</Badge>
                  <Badge variant="secondary" className="text-xs">FastAPI</Badge>
                  <Badge variant="secondary" className="text-xs">Power BI</Badge>
                  <Badge variant="secondary" className="text-xs">Python</Badge>
                </div>
                <div className="flex space-x-3 mt-4">
                  <a href="mailto:kiranashgowda007@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                    <MdEmail size={20} />
                  </a>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h4 className="text-lg font-semibold mb-3">Bio</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  I am a passionate AI/ML enthusiast, currently pursuing engineering with a major in AI/ML at SEA College of Engineering. 
                  I specialize in machine learning, deep learning, natural language processing, and creating powerful, scalable AI systems. 
                  My mission is to innovate and bring transformative AI solutions into the real world, whether through medical assistance AI 
                  or groundbreaking projects in Agentic AI. When I'm not diving into complex algorithms, I'm exploring the latest tech trends, 
                  building impactful projects, or enhancing my coding skills.
                </p>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">Education</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Bachelor of Engineering (AI/ML) – SEA College of Engineering
                </p>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">Notable Projects</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Agentic AI in Healthcare: AI system for medical assistance and drug recommendation based on symptoms.</li>
                  <li>Business Analyst AI: AI-powered platform for business analysis and marketing automation.</li>
                  <li>Portfolio Website: A dynamic website to showcase projects, skills, and achievements.</li>
                </ul>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">Goals</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Revolutionize healthcare with AI.</li>
                  <li>Continue building impactful AI projects that solve real-world problems.</li>
                  <li>Share my knowledge and experience to inspire and mentor others in the tech community.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-6">Ready to start your learning journey?</h2>
        <Link href="/roadmap">
          <Button size="lg" className="px-8">
            Create Your Roadmap
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>© 2025 LearnRoute. All rights reserved.</p>
      </motion.div>
    </motion.div>
  );
}
