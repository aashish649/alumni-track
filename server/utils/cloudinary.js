const cloudinary = require("cloudinary");

// const uploadToCloudinary = async (filePath, folder, attempts = 3) => {
//   try {
//     return await cloudinary.uploader.upload(filePath, {
//       folder: 'Alumni',
//       timeout: 60000,
//     });
//   } catch (error) {
//     if (attempts > 1) {
//       console.error(`Error uploading to Cloudinary. Retrying... Attempts left: ${attempts - 1}`);
//       await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
//       return uploadToCloudinary(filePath, folder, attempts - 1);
//     } else {
//       console.error('All retry attempts exhausted. Upload failed:', error);
//       throw error;
//     }
//   }
// };

// module.exports = { uploadToCloudinary };

const uploadToCloudinary = async (fileBuffer, folder, attempts = 5) => {
  try {
    return await cloudinary.uploader.upload_stream(
      { folder: folder, timeout: 60000 },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          throw error;
        }
      }
    ).end(fileBuffer);
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
