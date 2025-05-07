import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
      </svg>
    ),
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" x2="20" y1="19" y2="19"></line>
      </svg>
    ),
  },
  {
    title: "Resources",
    href: "/resources",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    ),
  },
];

interface MobileNavProps {
  closeMenu?: () => void;
  variant?: "menu" | "footer";
}

export default function MobileNav({ closeMenu, variant = "menu" }: MobileNavProps) {
  const [location] = useLocation();

  if (variant === "footer") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-2 z-10">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className="flex flex-col items-center p-2">
              <div className={cn(
                "p-1 rounded-lg",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-xs mt-1",
                location === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}>
                {item.title}
              </span>
            </a>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-card border-b border-border"
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  location === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </a>
            </Link>
          ))}
          <Link href="/about">
            <a
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                location === "/about"
                  ? "bg-primary/20 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={closeMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <span>About</span>
            </a>
          </Link>
          <Link href="/contact">
            <a
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                location === "/contact"
                  ? "bg-primary/20 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={closeMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Contact</span>
            </a>
          </Link>
        </nav>
      </motion.div>
    </AnimatePresence>
  );
}
