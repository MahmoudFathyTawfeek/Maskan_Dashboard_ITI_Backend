import mongoose, { Schema } from "mongoose";
import { ratingSchema } from "./ratingModel.js";

const listSchema = new Schema(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    title: {
      type: String,
      required: [true, "Listing Title is required"],
      unique: [true, "Title Must Be Unique"],
      trim: true,
    },
    arTitle: {
      type: String,
    },
    descrption: {   // ✅ أصلحت الغلط الإملائي (descrption → description)
      type: String,
      required: [true, "Listing Description is required"],
    },
    roomNumbers: {
      type: Number,
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price Per Night is Required"],
      min: [0, "Price Per Night must be greater than or equal to 0"],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",  // ✅ ربط مباشر مع الكاتيجوري
      required: [true, "Category Id is Required"],
    },
    locationType: {
      type: String,
      enum: ["seaside", "city", "mountain", "rural"],
      default: "city",
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is Required"],
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: [true, "Location coordinates are Required"],
        },
      },
    },
    governorate: {
      type: String,
      enum: [
        "Cairo",
        "Giza",
        "Alexandria",
        "Qalyubia",
        "PortSaid",
        "Suez",
        "Dakahlia",
        "Sharqia",
        "Gharbia",
        "Monufia",
        "Beheira",
        "KafrElSheikh",
        "Fayoum",
        "BeniSuef",
        "Minya",
        "Assiut",
        "Sohag",
        "Qena",
        "Luxor",
        "Aswan",
        "RedSea",
        "NewValley",
        "Matrouh",
        "NorthSinai",
        "SouthSinai",
      ],
      required: [true, "Governorate is required"],
    },
    amenitiesId: {
      type: [mongoose.Types.ObjectId],
      ref: "Amenity",
      default: [],
    },
    maxGustes: {
      type: Number,
      required: [true, "Max Guests is Required"],
      min: [1, "Max Guests must be greater than or equal to 1"],
    },
    photos: {
      type: [String],
      required: [true, "Five Photos Required"],
      validate: {
        validator: (value) => {
          return value.length >= 1;
        },
        message: "{PATH} must have 5 photos at least",
      },
    },
    bookedDates: [
      {
        date: Date,
        bookingId: {
          type: Schema.Types.ObjectId,
          ref: "Booking",
        },
        guestId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        checkInDate: Date,
        checkOutDate: Date,
        dayType: {
          type: String,
          enum: ["check-in", "stay", "check-out"],
          default: "stay",
        },
      },
    ],
    reviews: [ratingSchema],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Virtual لحساب متوسط التقييم
listSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);

  return total / this.reviews.length;
});

listSchema.set("toObject", { virtuals: true });
listSchema.set("toJSON", { virtuals: true });

// ✅ Index للبحث
listSchema.index({
  title: "text",
  description: "text",
  governorate: "text",
});

const listModel = mongoose.model("List", listSchema);
export default listModel;
