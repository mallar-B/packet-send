import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface PeerIdCardProps {
  className?: string;
  roomId: string;
}

const PeerIdCard = ({ className, roomId }: PeerIdCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-card border border-muted-foreground",
        className,
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Peer ID</h1>
      <div className="mb-4">
        <Label htmlFor="peerId" className="block text-lg font-mono mb-1 bg-accent pl-2 rounded">
          {roomId}
        </Label>
        <Button className="w-full mt-4 cursor-pointer">
          <span>Copy</span>
        </Button>
      </div>
    </div>
  );
};

export default PeerIdCard;
