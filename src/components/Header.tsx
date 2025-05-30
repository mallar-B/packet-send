import { SendHorizontal, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const dark = storedTheme === "dark";
    setIsDarkMode(dark);
    document.body.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="w-full border-b bg-card py-4 px-[15%]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SendHorizontal className="w-8 h-8 text-chart-4" />
          <h1 className="text-xl md:text-2xl font-bold text-sidebar-foreground">
            Packet<span className="text-chart-4">Send</span>
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-3xl hover:bg-muted transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="text-sidebar-foreground" size={25} />
          ) : (
            <Moon className="text-sidebar-foreground" size={25} />
          )}
        </button>
      </div>
    </header>
  );
}
