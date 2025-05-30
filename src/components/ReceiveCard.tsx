import { LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ReceiveCard = ({ className }: { className?: string }) => {
  const [peerIdInput, setPeerIdInput] = useState("");
  return (
    <div
      className={cn(
        "rounded-lg p-6 bg-background border-1 border-muted-foreground",
        className,
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Receive</h1>
      <div className="mb-4">
        <label htmlFor="peerId" className="block text-sm font-medium mb-1">
          Enter Peer ID: 
        </label>
        <input
          id="peerId"
          type="text"
          placeholder="e.g. abc-pqrs-xyz"
          value={peerIdInput}
          onChange={(e) => setPeerIdInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <Button
          // onClick={handleConnect}
          // isLoading={isConnecting}
          className="w-full mt-4 cursor-pointer"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          <span>Receive</span>
        </Button>
      </div>
    </div>
  );
};

export default ReceiveCard;
