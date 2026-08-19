require("dotenv").config();

const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");

const PORT =  5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);

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