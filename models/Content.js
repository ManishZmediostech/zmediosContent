const mongoose = require("mongoose");
const slugify = require("slugify");

const TableRowSchema = new mongoose.Schema({}, { strict: false });

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: String, required: true },   // ✅ NEW field
    description: { type: String, required: true },
    image: { type: String },
    table: [TableRowSchema],
  },
  { timestamps: true }
);

// Generate slug before saving
ContentSchema.pre("save", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Content", ContentSchema);
