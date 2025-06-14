"use client";
import { HardDriveDownload, HardDriveUpload, LinkIcon, Loader, Upload, X } from "lucide-react";
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
  leaveRoom,
  connectingToPeer,
  setConnectingToPeer,
}: {
  className?: string;
  joinRoom: any;
  channelRef: any;
  userId: any;
  isJoined: boolean;
  setIsJoined: (isJoined: boolean) => void;
  leaveRoom: () => void;
  connectingToPeer: boolean;
  setConnectingToPeer: (n: boolean) => void;
}) => {
  const [peerId, setPeerId] = useState("");
  const [receiverProgress, setReceiverProgress] = useState(0);

  useEffect(() => {
    if (receiverProgress === 100) {
      toast.success("File received successfully!");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 5000);
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
        setConnectingToPeer,
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
          connectingToPeer ? (
            <Button className="w-full mt-4 bg-muted-foreground pointer-events-none cursor-not-allowed">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              <span>Connecting</span>
            </Button>
          ) : (
            <Button
              className="w-full mt-4 cursor-pointer"
              onClick={() => handleReceive(peerId)}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              <span>Receive</span>
            </Button>
          )
        ) : receiverProgress < 100 ? (
          <div className="w-full grid grid-cols-6 gap-2">
            <Button className=" mt-4 col-span-4 cursor-not-allowed bg-muted-foreground hover:bg-muted-foreground pointer-events-none">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              <span>Receiving</span>
            </Button>
            <Button
              className=" mt-4 col-span-2 hover:bg-destructive bg-destructive/90 cursor-pointer"
              onClick={() => {
                setReceiverProgress(0);
                leaveRoom();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              <span>Cancel</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="mt-4 cursor-pointer col-span-1"
              onClick={() => window.location.reload()}
            >
              <HardDriveDownload className="w-4 h-4 mr-2" />
              <span>Receive again</span>
            </Button>
            <Button className="mt-4 cursor-pointer col-span-1"
              onClick={() => window.location.reload()}
            >
              <HardDriveUpload className="w-4 h-4 mr-2" />
              <span>Send</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveCard;
