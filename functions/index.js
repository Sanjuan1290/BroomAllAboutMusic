const functions = require("firebase-functions");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");

admin.initializeApp();

exports.uploadFile = functions.https.onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).send("");
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const fileBuffer = Buffer.from(req.body.file, "base64");
    const bucket = getStorage().bucket();
    const fileName = `packages/${Date.now()}_${req.query.name}`;
    const file = bucket.file(fileName);

    await file.save(fileBuffer, {
      contentType: req.query.type,
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send({ url });
  } catch (error) {
    console.error(error);
    res.set("Access-Control-Allow-Origin", "*");
    res.status(500).send("Upload failed");
  }
});
