import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: "dark" | "light";
    toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    effectiveTheme: "light",
    toggleTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        }
        return defaultTheme;
    });

    const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("light");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const applySystemTheme = () => {
                const systemTheme = mediaQuery.matches ? "dark" : "light";
                root.classList.remove("light", "dark");
                root.classList.add(systemTheme);
                setEffectiveTheme(systemTheme);
            };

            applySystemTheme();

            mediaQuery.addEventListener("change", applySystemTheme);
            return () => mediaQuery.removeEventListener("change", applySystemTheme);
        } else {
            root.classList.add(theme);
            setEffectiveTheme(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        effectiveTheme,
        toggleTheme: () => {
            const newTheme = theme === "dark" ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        }
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
