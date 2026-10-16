import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./router.js";

const app = express();
const PORT = process.env.PORT ||3000;

// import.meta.url provides the absolute URL of the current ES module life.
const file = fileURLToPath(import.meta.url);
// get the directory of the file
const __dirname = path.dirname(file);

// Serve the frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// parse JSON from comming requests
app.use(express.json());

app.use('/api', router);

app.get('/health', (req, res) =>{
    res.json({message: "OK"});
});

// Fallback for unmatched API routes
app.use('/api', (req, res) => {
    res.status(404).json({ message: "API endpoint not found." });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal server error"
    });
});

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});