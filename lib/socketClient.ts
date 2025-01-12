import { io } from "socket.io-client";

const socket = io("https://life-black.vercel.app/api") //io("http://localhost:3000"); // Replace with your backend URL

export default socket;
