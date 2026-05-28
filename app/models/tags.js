import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "#6366f1",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

TagSchema.virtual('expenses', {
  ref: "Expense",
  localField: '_id',
  foreignField: 'tagIds',
});

TagSchema.index({ user_id: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
