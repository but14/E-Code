const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    user_email      : { type : String, require : true , unique : true },
    user_name       : { type: String, required: true },
    user_password   : { type : String, require : true },
    avatar          : { type: String , default : ''},
    user_phone      : { type: String, required: true , unique : true},
    user_gender     : { type: String , default : ''},
    user_birth      : { type: Date },
    cart            : [{
        _id        : { type : Schema.Types.ObjectId , require : true},
        product    : { type : Schema.Types.ObjectId , ref : 'products', require : true}, // lưu trữ ObjectId sản phẩm đó 
        variant_id : { type : Schema.Types.ObjectId , ref : 'products', require : true}, // lưu trữ ObjectId sản phẩm ( varians) đó 
        quantity   : { type : Number  , default : 0 }
    }],
    current_orders : [{ type : Schema.Types.ObjectId, ref : "orders" }] ,
    sort           : { type : Number  , default :  0 },
    recent_notification :  [{ type : Schema.Types.ObjectId, ref : "notifications" }] , // tham chiếu ObjectId của Collection "notifications"
    user_address   : { type : String , default : '' },
    user_role      : { type : String , default : "user" }, // roles : user-seller ( tiểu thương)
    user_active    : { type : Boolean , default : false },
    createdAt      : { type : Date , default : new Date()},
    updatedAt      : { type : Date }
})

userSchema.index({createdAt : 1})
module.exports = mongoose.model("users" , userSchema)
