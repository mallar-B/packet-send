
export const useWebRTC = () => {
  const Peer = require("simple-peer");
  
  const startConnection = async ({
    userType,
    channelRef,
    userId, // Add unique identifier for each user
  }: {
    userType: "sender" | "receiver";
    channelRef: any;
    userId: string; // Add this parameter
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
          ],
        },
      });
    }

    // Send signal with sender identification
    peer.on("signal", (data: any) => {
      console.log("got this from peer and sending to channel", data);
      channelRef.current?.publish("signal", {
        signal: data,
        senderId: userId, // Include sender ID
      });
    });

    // Only process signals from other users
    channelRef.current?.subscribe("signal", (message: any) => {
      console.log("got this from channel", message.data);
      
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

    peer.on("connect", (data: any) => {
      console.log("connected p2p", data);
    });

    peer.on("error", (err: any) => {
      console.error("Peer error:", err);
    });

    return peer; // Return peer for potential cleanup
  };

  const closeConnection = (peer?: any) => {
    if (peer) {
      peer.destroy();
    }
  };

  return { startConnection, closeConnection };
};
