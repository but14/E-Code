const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reviewsSchema = new Schema({
    product_id           : { type : Schema.Types.ObjectId, ref: "products", require : true},
    product_variants_id  : { type : Schema.Types.ObjectId, ref: "products" , require : true},
    user_id              : { type : Schema.Types.ObjectId, ref: "users", require : true},
    order_id             : { type : Schema.Types.ObjectId, ref: "orders", require : true}, 
    variant_name         : { type : String , default : ''},
    user_infor : {
        user_name   : { type : String, default : '' },
        user_avatar : { type : String, default : '' },
    },
    review_rating  : { type : Number, default : 0 },
    review_context : { type : String, default : '' },
    review_imgs : [{
        _id           : { type : Schema.Types.ObjectId, auto : false},
        link : { type :String, default : ''} ,
        alt  : { type :String, default : ''}
    }],
    createdAt      : { type : Date , default : new Date()},
    updatedAt      : { type : Date },
    user_sort      : { type : Number, default : 0 }, // trường user_sort,product_sort dùng cho phân tích data bên python
    product_sort   : { type : Number, default : 0 }
})
reviewsSchema.index({ product_id : 1 }); // Thêm index cho userID
reviewsSchema.index({ userID: 1 }); // Thêm index cho userID
reviewsSchema.index({createdAt : 1})

module.exports = mongoose.model("reviews" , reviewsSchema)
