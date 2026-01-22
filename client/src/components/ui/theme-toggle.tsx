import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 relative overflowing-hidden"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === "dark" ? 0 : 1,
                    rotate: theme === "dark" ? 90 : 0
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Sun size={20} className="text-orange-500" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: theme === "dark" ? 1 : 0,
                    rotate: theme === "dark" ? 0 : -90
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Moon size={20} className="text-blue-400" />
            </motion.div>

            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
