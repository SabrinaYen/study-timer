import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Unknown" },
  createdAt: { type: Date, default: Date.now },
});

QuoteSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
