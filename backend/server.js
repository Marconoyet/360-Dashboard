const express = require("express");
const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000; // Change as needed

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" }); // ✅ Temporary upload location
async function downloadFileFromFTP(remoteFilePath, localFilePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable logs

  try {
    await client.access({
      host: "360business-partners.com",
      user: "ahmed123mah@360business-partners.com",
      password: "#QYtWHXX}!f+",
      secure: false,
    });

    await client.downloadTo(localFilePath, remoteFilePath);
    console.log("Download complete!");
  } catch (error) {
    console.error("FTP error:", error);
  } finally {
    client.close();
  }
}

// Function to upload file to FTP
async function uploadFileToFTP(localFilePath, remoteFilePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // ✅ Enable debugging logs

  try {
    await client.access({
      host: "360business-partners.com",
      user: "ahmed123mah@360business-partners.com",
      password: "#QYtWHXX}!f+",
      secure: false,
    });

    await client.uploadFrom(localFilePath, remoteFilePath);

    // ✅ Force timestamp update to refresh cache
    const currentTime = new Date();
    const formattedTime = currentTime.toISOString().replace(/[-:.TZ]/g, "");
    await client.send(`MFMT ${formattedTime} ${remoteFilePath}`);

    console.log("✅ Upload complete! Timestamp updated to force refresh.");
  } catch (error) {
    console.error("❌ FTP Upload Error:", error);
  } finally {
    client.close();
  }
}

// ✅ API endpoint to upload a translation file
app.post("/upload", upload.single("file"), async (req, res) => {
  const lang = req.body.lang || "en"; // Default language is "en"
  const localFilePath = req.file.path; // ✅ Path to uploaded file
  const remoteFilePath = `/locales/${lang}/translation.json`; // ✅ Remote FTP path

  try {
    await uploadFileToFTP(localFilePath, remoteFilePath);
    setTimeout(() => fs.unlink(localFilePath, () => {}), 5000);
    res.json({ success: true, message: "File uploaded successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Error uploading file." });
  }
});

// ✅ API endpoint to download a translation file
app.get("/download", async (req, res) => {
  const lang = req.query.lang || "en"; // Default to English
  const remoteFilePath = `/locales/${lang}/translation.json`;
  const localFilePath = path.join(
    __dirname,
    "downloads",
    `${lang}-translation.json`
  );

  try {
    await downloadFileFromFTP(remoteFilePath, localFilePath);
    res.download(localFilePath, `${lang}-translation.json`, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Error downloading file.");
      }
      fs.unlinkSync(localFilePath); // ✅ Cleanup after download
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error downloading file." });
  }
});

// ✅ API endpoint to serve local translations
app.get("/download-local", (req, res) => {
  const lang = req.query.lang || "en";
  const filePath = path.join(__dirname, "locales", lang, "translation.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Language file not found" });
  }

  res.sendFile(filePath);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
