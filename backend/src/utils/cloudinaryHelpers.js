const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'marketplace_products',
        quality: 'auto',          // Auto compress without visible quality loss
        fetch_format: 'auto',     // Serve WebP/AVIF to supported browsers
        flags: 'progressive',     // Progressive JPEG for faster perceived load
        transformation: [
          { width: 800, crop: 'limit' }, // Cap at 800px wide — no oversized images
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
