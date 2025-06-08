"use client";
import { HardDriveDownload, LinkIcon, Loader, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { startConnection } from "@/lib/webRTC";
import { Progress } from "./ui/progress";
import toast from "react-hot-toast";

const ReceiveCard = ({
  className,
  joinRoom,
  channelRef,
  userId,
  isJoined,
  setIsJoined,
}: {
  className?: string;
  joinRoom: any;
  channelRef: any;
  userId: any;
  isJoined: boolean;
  setIsJoined: (isJoined: boolean) => void;
}) => {
  const [peerId, setPeerId] = useState("");
  const [receiverProgress, setReceiverProgress] = useState(0);

  useEffect(() => {
    if (receiverProgress === 100) {
      toast.success("File received successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [receiverProgress]);

  const handleReceive = (peerId: string) => {
    try {
      joinRoom(peerId);
      setIsJoined(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isJoined) {
      startConnection({
        userType: "receiver",
        channelRef: channelRef,
        userId,
        setReceiverProgress,
      });
    }
  }, [isJoined]);

  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-card border border-muted-foreground",
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
          onChange={(e) => {
            setPeerId(e.target.value);
          }}
          className="w-full p-2 border rounded-md placeholder-muted-foreground"
        />
        {receiverProgress !== 0 && receiverProgress !== 100 ? (
          <div className="flex w-full items-center justify-center mt-4 gap-2">
            <Progress value={receiverProgress} />
            <span className="text-xl font-black">{receiverProgress}%</span>
          </div>
        ) : null}

        {receiverProgress === 0 ? (
          <Button
            className="w-full mt-4 cursor-pointer"
            onClick={() => handleReceive(peerId)}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            <span>Receive</span>
          </Button>
        ) : receiverProgress < 100 ? (
          <Button className="w-full mt-4 cursor-not-allowed bg-muted-foreground hover:bg-muted-foreground pointer-events-none">
            <Loader className="w-4 h-4 mr-2" />
            <span>Receiving</span>
          </Button>
        ) : (
          <div className="">
            <Button
              className="mt-4 cursor-pointer w-full"
              // onClick={() => handleReceive(peerId)}
            >
              <HardDriveDownload className="w-4 h-4 mr-2" />
              <span>Received</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveCard;
