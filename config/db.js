const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_ATLAS);
    console.log(" MongoDB Atlas Connected Successfully");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1); // الخروج من التطبيق عند فشل الاتصال
  }
};

module.exports = connectDB;
