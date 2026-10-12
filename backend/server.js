import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import router from "./router.js";

const app = express();
const PORT = 3000;

// import.meta.url provides the absolute URL of the current ES module life.
const file = fileURLToPath(import.meta.url);
// get the directory of the file
const __dirname = path.dirname(file);

// Serve the frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// parse JSON from comming requests
app.use(express.json());

app.get('/health', (req, res) =>{
    res.json({message: "OK"});
});

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});