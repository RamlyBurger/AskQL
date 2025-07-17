import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import databaseRoutes from "./routes/databaseRoutes";
import tableRoutes from "./routes/tableRoutes";
import attributeRoutes from "./routes/attributeRoutes";
import tableDataRoutes from "./routes/tableDataRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/databases', databaseRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/tables', tableDataRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message
    });
});

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection initialized");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error initializing database connection:", error);
        process.exit(1);
    }); 