const mongoose = require("mongoose")
const Schema = mongoose.Schema   
const productSchema = new Schema({
    product_name : { type : String , require :true, unique : true },
    product_slug : { type : String , require : true, unique :true},
    product_imgs : [{
        _id   : { type : Schema.Types.ObjectId, auto : false},
        link : { type : String , require : true},
        alt  : { type : String },
    }],
    product_short_description : { type : String, default : ''},
    product_description       : { type : String , default : '' },
    product_details           : [{
        _id   : { type : Schema.Types.ObjectId, auto : false},
        name  : { type : String},
        value : { type : String},
    }],
    product_sold_quantity      : { type : Number , default : 0},
    product_variants           : [{
        _id   : { type : Schema.Types.ObjectId, require : true, auto :true},
        variant_name : { type : String , default : ''},
        variant_slug : { type : String , default : ''},
        price : { type : Number , default : 0 },
        variant_imgs : [{
            _id   : { type : Schema.Types.ObjectId, auto : false},
            link : { type : String , require : true},
            alt  : { type : String , require : true}
        }],
        discount_id     : { type : Schema.Types.ObjectId },
        discount_amount : { type : Number},
        is_available    : { type : Boolean , default : false },
        in_stock        : { type : Number}
    }],
    sort                : {type : Number  , default :  0 },
    userID              : {type : Schema.Types.ObjectId , ref : 'users', require : true}, // thuộc về người sở hữu, người tạo ra sản phẩm này
    product_avg_rating  : { type : Number , default : 0 },
    categories          : { type : Schema.Types.ObjectId, ref : "categories" , require : true }, 
    category_name       : { type: String },                                             // khi truy vấn thì ko cần truy vấn tới Collection khác, tăng truy vấn tại đây
    recent_reviews      : [{
        review_id    : { type: Schema.Types.ObjectId, ref: 'reviews' },
        variant_name : { type : String , default : ''},
        user_infor   : {
            user_name: { type: String },
            user_avatar: { type: String }
        },
        review_rating: { type: Number },
        review_context: { type: String },
        review_imgs: [{ 
            link:  { type : String , default : ''},
            alt :  { type : String , default : '' }
         }],
        review_date: { type: Date }
    }],  // chứa mảng các ObjectId review mới nhất , giảm thiểu sự truy vấn
    review_count        : { type : Number , default : 0},
    product_supp_price  : { type : Number , default : 0},
    createdAt           : { type : Date , default : new Date() },
    updatedAt           : { type : Date }
})

productSchema.index({ product_name: "text" });
productSchema.index({ product_slug: "text" });
productSchema.index({ product_short_description: "text" });
productSchema.index({ userID: 1 }); // Thêm index cho userID
productSchema.index({"product_details.name" : 1 , "product_details.value" : 1})

 // nếu truy vấn theo product_details.name và product_value thì sẽ nhanh, 
 // còn nếu truy product_details.name cũng sẽ nhanh
 // nhưng nếu truy vấn theo product_details.value thì sẽ chậm vì nó được đánh index theo product_detail.name




module.exports = mongoose.model("products" , productSchema)



// categories, category_name, UserID, createdAt, và product_sold_quantity.