require('dotenv').config();
const { uploadToCloudinary, deleteFromCloudinary } = require('./src/utils/cloudinaryHelpers');

const testCloudinary = async () => {
  try {
    console.log('Attempting to upload test image to Cloudinary...');
    
    // 1x1 pixel transparent PNG buffer
    const testBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    const result = await uploadToCloudinary(testBuffer);
    console.log('✅ Cloudinary upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);

    console.log('Attempting to delete test image...');
    await deleteFromCloudinary(result.public_id);
    console.log('✅ Cloudinary deletion successful!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Cloudinary test failed!');
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testCloudinary();
