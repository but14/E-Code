const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkvtnocoe",
  api_key: "497738827299982",
  api_secret: "lhagYwhtXTciop5360SPHtmOTTQ",
});

module.exports = cloudinary;