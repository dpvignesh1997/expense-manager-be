var cloudinary = require("cloudinary").v2;
const { extname } = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Upload Image to Cloudinary
 * @param {Object} video
 * @param {String} path
 * @returns {String}
 */
const uploadImage = async (file, path) => {
  try {
    const result = await cloudinary.uploader.upload(file["path"], {
      resource_type: "image",
      public_id: path,
      eager_async: true,
      eager: {
        transformation: [
          {
            quality: "auto",
          },
        ],
      },
    });

    let url = result.secure_url;

    if (result.eager && result.eager.length) {
      url = result.eager[0]["secure_url"];
    }

    return url;
    z;
  } catch (error) {
    // Log the Error
    console.error("Error while uploading Image to Cloudinary => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Delete File from Cloudinary
 * @param {String} url
 * @param {String} folder
 * @param {String} resource_type
 * @returns {Object}
 */
const deleteFile = async (url, folder, resource_type = "image") => {
  try {
    // Get the Public ID of the Video
    const splits = String(url).split("/");
    const extension = extname(splits[splits.length - 1]);
    const publicId = splits[splits.length - 1].split(extension)[0];

    const deleteResult = await cloudinary.uploader.destroy(
      `${folder}/${publicId}`,
      {
        resource_type,
      }
    );

    return deleteResult;
  } catch (error) {
    console.error("Error while deleteing file in Cloudinary => ", error);

    throw error;
  }
};

module.exports = { uploadImage, deleteFile };
