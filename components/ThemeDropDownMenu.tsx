"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";
import { twMerge } from "tailwind-merge";

export type ThemeDropDownMenuProps = {
  className?: string;
};

/**
 * A dropdown menu component that allows users to toggle between different themes (light, dark, and system theme).
 * The component uses the `next-themes` library to manage the theme state.
 *
 * @param className - Optional custom class name for styling the dropdown menu.
 *
 * @returns A dropdown menu with theme options (Light, Dark, System) and respective icons for Sun (light) and Moon (dark).
 */
export function ThemeDropDownMenu({ className }: ThemeDropDownMenuProps) {
  const { setTheme } = useTheme();

  return (
    <div className={twMerge("z-20", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
