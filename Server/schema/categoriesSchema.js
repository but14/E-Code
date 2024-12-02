const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Các danh mục chính
const parentCategories = [
    { name: "Thời trang nam", img: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp" },
    { name: "Điện thoại và phụ kiện", img: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w320_nl.webp" },
    { name: "Thiết bị điện tử", img: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w320_nl.webp" },
    { name: "Máy tính và laptop", img: "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w320_nl.webp" },
    { name: "Đồng hồ", img: "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w320_nl.webp" },
    { name: "Giày dép nam", img: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w320_nl.webp" },
    { name: "Các loại hoa", img: "https://media.vov.vn/sites/default/files/styles/large/public/2021-02/h4_6.jpg" },
    { name: "Thời trang nữ", img: "https://down-vn.img.susercontent.com/file/48630b7c76a7b62bc070c9e227097847@resize_w320_nl.webp" },
];

const categorySchema = new Schema({
    category_name: { type: String, required: true, unique: true },
    userID: [{ type: Schema.Types.ObjectId, ref: 'users', required: true }], // thuộc về người sở hữu, người tạo ra sản phẩm này
    category_slug: { type: String, required: true, unique: true },
    category_short_description: { type: String, default: '' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date },
    parentCategory: {
        name: { type: String, required: true, default: ''},
        img: { type: String, required: true, default: '' }
    } // Danh mục chính mà category này thuộc về, kèm theo link ảnh
});

// Tạo chỉ mục cho createdAt
categorySchema.index({ createdAt: 1 });
categorySchema.index({ 'parentCategory.name': 1 }); // Tạo chỉ mục cho parentCategory.name


module.exports = mongoose.model("categories", categorySchema);
