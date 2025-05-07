import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Roadmap from "@/pages/Roadmap";
import Resources from "@/pages/Resources";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AuthPage from "@/pages/auth-page";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";


// App wrapper with auth provider
function AppWithAuth() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Main app content
function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if current route is the auth page
  const isAuthPage = location === "/auth";
  
  // If we're on the auth page, render without sidebar
  if (isAuthPage) {
    return (
      <TooltipProvider>
        <main className="h-screen">
          <Switch>
            <Route path="/auth" component={AuthPage} />
          </Switch>
        </main>
        <Toaster />
      </TooltipProvider>
    );
  }
  
  // Otherwise render with sidebar and navigation
  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <div className="md:hidden sticky top-0 z-10">
            <div className="flex items-center justify-between p-4 bg-card border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="bg-primary rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-foreground">LearnRoute</h1>
              </div>
              <button onClick={toggleMobileMenu} className="text-foreground p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18"></path>
                  )}
                </svg>
              </button>
            </div>
            {mobileMenuOpen && <MobileNav closeMenu={() => setMobileMenuOpen(false)} />}
          </div>
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <Switch>
                <ProtectedRoute path="/" component={Home} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/roadmap" component={Roadmap} />
                <ProtectedRoute path="/resources" component={Resources} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/auth" component={AuthPage} />
                <Route component={NotFound} />
              </Switch>
            </AnimatePresence>
          </main>
          <div className="md:hidden">
            <MobileNav variant="footer" />
          </div>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

export default AppWithAuth;
