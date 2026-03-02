import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hoverScale?: boolean;
}

const GlassCard = ({ children, className, glow = false, hoverScale = true }: GlassCardProps) => (
  <motion.div
    whileHover={hoverScale ? { scale: 1.02, y: -4 } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn(
      "rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl",
      glow && "shadow-[0_0_30px_hsl(173,80%,40%,0.1),0_0_60px_hsl(173,80%,40%,0.05)]",
      "transition-shadow duration-300 hover:shadow-[0_0_40px_hsl(173,80%,40%,0.15),0_0_80px_hsl(173,80%,40%,0.08)]",
      className
    )}
  >
    {children}
  </motion.div>
);

export default GlassCard;
