const express = require("express");
const multer = require("multer");
const Content = require("../models/Content");
const slugify = require("slugify");

const router = express.Router();

// --- Multer Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- CREATE CONTENT ---
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      table,
      metaTitle,
      metaDescription,
      canonicalTag,
      metaKeywords,
      faqSchema,
    } = req.body;

    // const slug = title.toLowerCase().replace(/ /g, "-");

    const newContent = new Content({
      title,
      slug,
      category,
      description,
      table: table ? JSON.parse(table) : [],
      image: req.file ? `/uploads/${req.file.filename}` : null,

      // ✅ SEO Fields
      metaTitle,
      metaDescription,
      canonicalTag,
      metaKeywords: metaKeywords ? metaKeywords.split(",") : [],

      // ✅ FAQ Schema (parse JSON string to array)
      faqSchema: faqSchema ? JSON.parse(faqSchema) : [],
    });

    await newContent.save();
    res.status(201).json({ success: true, data: newContent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- GET ALL CONTENT ---
router.get("/", async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- UPDATE CONTENT ---
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      category,
      slug,
      description,
      table,
      metaTitle,
      metaDescription,
      canonicalTag,
      metaKeywords,
      faqSchema,
    } = req.body;

    const updateData = {
      title,
      slug,
      category,
      description,
      table: table ? JSON.parse(table) : undefined,

      metaTitle,
      metaDescription,
      canonicalTag,
      metaKeywords: metaKeywords ? metaKeywords.split(",") : undefined,
      faqSchema: faqSchema ? JSON.parse(faqSchema) : undefined,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedContent) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, data: updatedContent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- DELETE CONTENT ---
router.delete("/:id", async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }
    res.json({ success: true, message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- DELETE IMAGE ONLY ---
router.patch("/:id/remove-image", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    content.image = null;
    await content.save();

    res.json({ success: true, message: "Image removed", data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- GET CONTENT BY SLUG ---
router.get("/slug/:slug", async (req, res) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug });

    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- GET CONTENT BY ID ---
router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
