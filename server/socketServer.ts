import { Server } from "socket.io";

let io: Server | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initializeSocketServer = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "https://life-black.vercel.app/"  , //"http://localhost:3000", // Update to your frontend domain
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinRoom", (userId) => {
        socket.join(userId); // Join room for real-time updates
        console.log(`User ${socket.id} joined room: ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  return io;
};

export { io };
