import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-background py-4 px-[15%]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SendHorizontal className="w-8 h-8 text-chart-4" />
          <h1 className="text-xl md:text-2xl font-bold text-sidebar-foreground">
            Packet<span className="text-chart-4">Send</span>
          </h1>
        </div>
      </div>{" "}
    </header>
  );
}
