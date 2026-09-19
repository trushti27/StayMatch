require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("./models/Chat");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || true, credentials: true } });
        io.use((socket,next)=>{try { socket.userId=jwt.verify(socket.handshake.auth?.token,process.env.JWT_SECRET).userId; next(); } catch(e) { next(new Error("Unauthorized socket")); }});
        io.on("connection", socket => { socket.on("chat:join", async chatId => { const chat=await Chat.findOne({_id:chatId,participants:socket.userId}); if(chat) socket.join(`chat:${chatId}`); }); });
        app.set("io",io);

        server.listen(PORT,"0.0.0.0",() => {
            console.log(
                `StayMatch Server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
