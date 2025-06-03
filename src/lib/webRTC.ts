const Peer = require("simple-peer");

export const sendFile = async (
  channelRef: any,
  peer: any,
  file: any,
  setSenderProgress?: (n: number) => void,
) => {
  const chunkSize = 1024 * 16; // 16kb
  let offset = 0;
  let progress = 0;

  // If size is < 16kb send the whole file at once
  if (file.size < chunkSize) {
    const buffer = await file.arrayBuffer();
    peer.send(buffer);
    return;
  }

  // Else send the file in chunks
  const sendNextChunk = async () => {
    const chunk = file.slice(offset, offset + chunkSize);
    const buffer = await chunk.arrayBuffer();
    console.log("chunk is", chunk);
    console.log("actual buffer is", buffer);
    console.log("current offset is", offset);
    console.log("current progress is", progress);
    peer.send(buffer);
    offset += chunkSize;
    progress += (chunkSize / file.size) * 100;
    if (setSenderProgress) {
      setSenderProgress(Math.round(progress));
    }

    if (offset < file.size) {
      setTimeout(sendNextChunk, 100);
    } else {
      console.log("finished sending file");
      if (setSenderProgress) {
        setSenderProgress(100);
      }
      channelRef.current.publish("finished sending", {
        fileName: file.name,
        fileSize: file.size,
      });
    }
  };
  sendNextChunk();
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
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });
  } else {
    peer = new Peer({
      initiator: false,
      trickle: true,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
