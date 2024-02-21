


const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (fileBuffer, folder, attempts = 5) => {
  try {
    return new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      upload_stream.end(fileBuffer);
    });
  } catch (error) {
    if (attempts > 1) {
      console.error(`Error uploading to Cloudinary. Retrying... Attempts left: ${attempts - 1}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return uploadToCloudinary(fileBuffer, folder, attempts - 1);
    } else {
      console.error('All retry attempts exhausted. Upload failed:', error);
      throw error;
    }
  }
};

module.exports = { uploadToCloudinary };
