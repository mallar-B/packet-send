import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    const { type, room } = data;
    if (type === "join") {
      if (rooms.has(room)) {
        rooms.get(room).add(ws);
      } else {
        ws.send(
          JSON.stringify({
            type: "error",
            payload: `Room ${room} does not exist`,
          }),
        );
      }
    }
    if (type === "create") {
      if (rooms.has(room)) {
        ws.send(
          JSON.stringify({
            type: "error",
            payload: `Room ${room} already exists`,
          }),
        );
      } else {
        rooms.set(room, new Set([ws]));
      }
    }
  });

  ws.on("close", () => {
    rooms.forEach((peers) => {
      const index = peers.indexOf(ws);
      if (index !== -1) peers.splice(index, 1);
    });
  });
});
