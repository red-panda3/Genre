import express from 'express'
import cors from'cors'
import multer from 'multer';
const app = express();
app.use(cors()); // Enable CORS for frontend requests
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Multer config: Save uploaded files in "uploads/" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  },
});
const upload = multer({ storage });
// Upload API endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  res.json({
    message: "File uploaded successfully!",
    fileUrl: `http://localhost:5000/uploads/${req.file.originalname}`,
  });
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));