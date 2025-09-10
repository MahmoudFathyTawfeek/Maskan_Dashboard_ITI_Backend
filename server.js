console.log("🚀 Starting server...");

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// تحميل الراوترات
import userRoutes from './routes/user.js';
import unitRoutes from './routes/unit.js';
import listingRoutes from './routes/listing.js';
import bookingRoutes from './routes/booking.js';
import amenityRoutes from './routes/amenity.js';
import categoryRoutes from "./routes/category.js";
import pendingListingRoutes from './routes/pendinglisting.js';
import authRoutes from "./routes/auth.js";


// تحميل الموديلات (علشان تتسجل في mongoose)
import './models/categoryModel.js';
import './models/amenityModel.js';
import './models/booking.js';
import './models/user.js';
import './models/listing.js'; // لازم تستورد listing كمان علشان البيندنج يشتغل



dotenv.config();

// اتصال بقاعدة البيانات
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// استخدام الراوترات
app.use('/api/users', userRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/amenities', amenityRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/pending-listings', pendingListingRoutes);
// Auth routes
app.use("/api/auth", authRoutes);




// تشغيل السيرفر
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
