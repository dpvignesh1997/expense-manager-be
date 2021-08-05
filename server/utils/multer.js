var multer = require("multer");
const { join, extname } = require("path");
const { sync } = require("mkdirp");

/**
 * Multer Configuration
 * @param {String} path
 * @returns
 */
module.exports = (path) => {
  return multer.diskStorage({
    destination: async function (req, file, cb) {
      const DIR = path ? path : join(__dirname, "../../", "uploads/");
      await sync(DIR);
      cb(null, DIR);
    },
    filename: function (req, file, cb) {
      const fileExt =
        String(file["mimetype"]).split("/")[1] || extname(file.originalname);
      cb(null, Date.now() + "_" + file.originalname + `.${fileExt}`);
    },
  });
};
