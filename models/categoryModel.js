import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    arName: {
      type: String,
      required: [true, "Category Arabic name is required"],
      unique: true,
      trim: true,
    }
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual field علشان نجيب عدد الإعلانات المرتبطة بالكاتيجوري
categorySchema.virtual("listings", {
  ref: "Listing",          // اسم الموديل المرتبط
  localField: "_id",       // الـ id بتاع الكاتيجوري
  foreignField: "categoryId", // الفيلد اللي في Listing بيربط بالكاتيجوري
  justOne: false,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
