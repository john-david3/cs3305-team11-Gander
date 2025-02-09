import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

//  Defines the Theme (Colour Theme) that would be shared/used
interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

//  Store theme and provide access to setTheme function
//  If no provider is used, set to undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Set default theme to dark

    const [theme, setTheme] = useState<string>(() => {
        // If exist on user cache, use that instead
        return localStorage.getItem("user-theme") || "dark";
    });

    useEffect(() => {
        // Store current theme set by user
        localStorage.setItem("user-theme", theme);

        // Update the theme
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        // Sets the selected theme to child component
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

//  Custom Hook which allows any component to access theme & setTheme with "useTheme()"
export const useTheme = () => {
    const context = useContext(ThemeContext);   //Retrieves current value of context
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");    //If called outside of ThemeContext.tsx, errorHandle
    }
    return context;
};


{/** 
    
    createContext: Allow components to share data without directly passing props through multiple levels
    useContext: Allows a component to access the current value of a context ("Hook")
    useState: Manages state of a component ("Hook")
    ReactNode: Allows to take in HTML / React / Arrays of Component
    
    */}