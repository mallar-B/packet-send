const Peer = require("simple-peer");

export const sendFile = async (
  channelRef: any,
  peer: any,
  file: File,
  setSenderProgress?: (n: number) => void,
) => {
  const chunkSize = 16 * 1024; // 16 KB
  const maxBuffer = 1 * 1024 * 1024; // 1 MB
  const lowWaterMark = 512 * 1024; // Resume when buffer drops below 512 KB
  let offset = 0;

  peer.bufferedAmountLowThreshold = lowWaterMark;

  const sendChunk = async () => {
    while (offset < file.size) {
      // Wait if buffer is full
      if (peer.bufferedAmount > maxBuffer) {
        await new Promise((resolve) => {
          const onLow = () => {
            peer.removeEventListener("bufferedamountlow", onLow);
            resolve(null);
          };
          peer.addEventListener("bufferedamountlow", onLow);
        });
      }

      // Read and send next chunk
      const chunk = file.slice(offset, offset + chunkSize);
      const buffer = await chunk.arrayBuffer();
      peer.send(buffer);

      offset += chunkSize;

      // Update progress
      if (setSenderProgress) {
        setSenderProgress(
          Math.min(100, Math.round((offset / file.size) * 100)),
        );
      }
    }

    // Done
    if (setSenderProgress) setSenderProgress(100);
    channelRef.current.publish("finished sending", {
      fileName: file.name,
      fileSize: file.size,
    });
  };

  sendChunk();
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
  const fileStream = streamSaver.createWriteStream(fileName);
  const writer = fileStream.getWriter();
  let progress = 0;
  let totalReceived = 0;

  // When the file is finished sending
  channelRef.current.subscribe("finished sending", (message: any) => {
    console.log("finished sending", message.data);
    writer.close();
    if (setReceiverProgress) {
      setReceiverProgress(100);
    }
  });

  peer.on("data", async (chunk: any) => {
    await writer.write(chunk);
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
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun.l.google.com:5349" },
          { urls: "stun:stun1.l.google.com:3478" },
          { urls: "stun:stun1.l.google.com:5349" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:5349" },
          { urls: "stun:stun3.l.google.com:3478" },
          { urls: "stun:stun3.l.google.com:5349" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:5349" },
        ],
      },
    });
  } else {
    peer = new Peer({
      initiator: false,
      trickle: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun.l.google.com:5349" },
          { urls: "stun:stun1.l.google.com:3478" },
          { urls: "stun:stun1.l.google.com:5349" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:5349" },
          { urls: "stun:stun3.l.google.com:3478" },
          { urls: "stun:stun3.l.google.com:5349" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:5349" },
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
  channelRef.current?.subscribe("receiver ready", (message: any) => {
    if (userType === "sender") {
      console.log("sending to", message.data);
      sendFile(channelRef, peer, file, setSenderProgress);
    }
  });

  peer.on("error", (err: any) => {
    console.error("Peer error:", err);
  });

  return peer;
};

export const closeConnection = (peer?: any) => {
  if (peer) {
    peer.destroy();
  }
};
