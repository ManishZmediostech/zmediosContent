const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: { type: String, required: true },

    // ✅ SEO Fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    canonicalTag: { type: String },
    metaKeywords: [{ type: String }],

    // ✅ FAQ Schema (multiple Q&A)
    faqSchema: [faqSchema],

    description: { type: String }, // rich text editor content
    image: { type: String },
    table: { type: Array }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
