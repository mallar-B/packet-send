import toast from "react-hot-toast";

const Peer = require("simple-peer");
let receiveCancelled = false;

export const sendFile = async (
  channelRef: any,
  peer: any,
  file: File,
  setSenderProgress?: (n: number) => void,
) => {
  const chunkSize = 16 * 1024; // 16 KB
  const maxBuffer = 512 * 1024; // 512 KB
  const lowWaterMark = 64 * 1024; // Resume when buffer drops below 64 KB
  let offset = 0;

  // Set the threshold for bufferedamountlow event
  peer.bufferedAmountLowThreshold = lowWaterMark;

  const sendChunk = async () => {
    while (offset < file.size) {
      // Check buffer before sending each chunk
      while (peer.bufferedAmount >= maxBuffer) {
        await new Promise((resolve) => {
          const onLow = () => {
            peer.removeEventListener("bufferedamountlow", onLow);
            resolve(null);
          };
          peer.addEventListener("bufferedamountlow", onLow);
        });
      }

      const chunk = file.slice(offset, offset + chunkSize);
      const buffer = await chunk.arrayBuffer();

      try {
        peer.send(buffer);
      } catch (error: any) {
        // If send fails, wait a bit and retry
        if (error.message.includes("send queue is full")) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue; // Retry this chunk
        }
        throw error; // Re-throw other errors
      }

      offset += chunkSize;

      // Update progress
      if (setSenderProgress) {
        setSenderProgress(
          Math.min(100, Math.round((offset / file.size) * 100)),
        );
      }

      // Small delay to prevent overwhelming the connection
      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    // Done
    peer.send(JSON.stringify({ type: "done" }));
    console.log("file sent from sender");
  };

  await sendChunk();
};

export const receiveFile = async (
  channelRef: any,
  peer: any,
  fileName: string,
  fileSize: number,
  setReceiverProgress?: (n: number) => void,
) => {
  const streamSaverModule = await import("streamsaver");
  const streamSaver = streamSaverModule.default;
  const fileStream = streamSaver.createWriteStream(fileName, {
    size: fileSize,
  });
  const writer = fileStream.getWriter();
  let progress = 0;
  let totalReceived = 0;

  // When the file is finished sending
  channelRef.current.subscribe("finished sending", async (message: any) => {
    console.log("finished sending", message.data);
    console.log("but receiver progress", progress);
    // await writer.close();
    // if (setReceiverProgress) {
    //   setReceiverProgress(100);
    // }
  });

  peer.on("data", (chunk: any) => {
    try {
      const message = JSON.parse(chunk);
      if (message.type === "done") {
        writer.close();
        if (setReceiverProgress) {
          setReceiverProgress(100);
        }
        return;
      }
    } catch (error) {}
    try {
      writer.write(chunk);
    } catch (error) {
      // if (receiveCancelled) return;
      // toast.error("Transfer canceled");
      // receiveCancelled = true;
      // channelRef.current.publish("receiver canceled", { fileName });
    }
    totalReceived += chunk.byteLength;
    progress = Math.min(100, Math.round((totalReceived / fileSize) * 100));
    console.log("receiver progress is", progress);
    if (setReceiverProgress) {
      setReceiverProgress(Number(progress));
    }
  });
  // await writer.close();
};

export const startConnection = async ({
  userType,
  channelRef,
  userId,
  file,
  setReceiverProgress,
  setSenderProgress,
}: {
  userType: "sender" | "receiver";
  channelRef: any;
  userId: string;
  file?: any;
  setReceiverProgress?: (n: number) => void;
  setSenderProgress?: (n: number) => void;
}) => {
  console.log("startConnection ran");

  let peer: any;

  if (userType === "sender") {
    peer = new Peer({
      initiator: true,
      trickle: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:5349" },
          { urls: "stun:stun1.l.google.com:5349" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:3478" },
        ],
      },
    });
  } else {
    peer = new Peer({
      initiator: false,
      trickle: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:5349" },
          { urls: "stun:stun1.l.google.com:5349" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:3478" },
        ],
      },
    });
  }

  // Send signal with sender identification
  peer.on("signal", (data: any) => {
    channelRef.current?.publish("signal", {
      signal: data,
      senderId: userId,
    });
  });

  // Only process signals from other users
  channelRef.current?.subscribe("signal", (message: any) => {
    // Ignore signals from self
    if (message.data.senderId === userId) {
      console.log("Ignoring own signal");
      return;
    }

    try {
      peer.signal(message.data.signal);
    } catch (error) {
      console.error("Error processing signal:", error);
    }
  });

  // On connect send file
  peer.on("connect", (data: any) => {
    console.log("connected p2p", data);
    if (userType === "sender" && file) {
      channelRef.current?.publish(
        "sending",
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
        }),
      );
    }
  });

  // Listen for incoming file
  channelRef.current?.subscribe("sending", (message: any) => {
    if (userType === "receiver") {
      const { fileName, fileSize } = JSON.parse(message.data);
      console.log("Receiving file", fileName, fileSize);
      if (setReceiverProgress) {
        receiveFile(channelRef, peer, fileName, fileSize, setReceiverProgress);
      } else {
        receiveFile(channelRef, peer, fileName, fileSize);
      }
      // Send confirmation ready to receive file
      channelRef.current?.publish("receiver ready", userId);
    }
  });

  // If receiver is ready to receive file send it
  channelRef.current?.subscribe("receiver ready", async (message: any) => {
    if (userType === "sender") {
      console.log("sending to", message.data);
      await sendFile(channelRef, peer, file, setSenderProgress);
    }
  });

  // Listen for graceful disconnect
  channelRef.current?.subscribe("receiver canceled", (message: any) => {
    console.log(message.data, "canceled file transfer");
    if (setSenderProgress) {
      setSenderProgress(0);
    }
    if (setReceiverProgress) {
      setReceiverProgress(0);
    }
    closeConnection(peer);
    toast.error("Transfer Canceled", {
      duration: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });

  peer.on("error", (err: Error) => {
    if (err.message === "User-Initiated Abort, reason=Close called") {
      toast.error("Peer Disconnected");
      closeConnection(peer);
      return;
    }
    console.error(err);
  });

  return peer;
};

export const closeConnection = (peer?: any) => {
  if (peer) {
    peer.removeAllListeners("data");
    peer.destroy();
    console.log("peer destroyed");
  }
};
