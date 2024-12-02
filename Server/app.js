const express = require('express')
const app = express()
const path = require('path');
app.use(express.json()); // Add this line

require('dotenv').config()

// mở kết nối tới Mongoose
const mongoose = require('mongoose');
main().then(()=>{
  console.log("Thành công kết nối Mongoose");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}
// Mở port để angular connect được
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const cors = require("cors");
app.use(cors());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: ['Authorization']
}));

// Thiết lập thư mục tĩnh
app.use('/public', express.static(path.join(__dirname, 'public')));

// khai báo các Collection để tạo Collection trong mongooseDB
const users = require('./schema/usersSchema')
const products = require('./schema/productsSchema')
const categories = require('./schema/categoriesSchema')
const orders = require('./schema/ordersSchema')
const reviews = require('./schema/reviewsSchema')

// Midleware 
const authentication = require('./middleware/authentication'); // Import the middleware
// các hàm như create, update, sẽ được dùng thông qua các model không phải các Schema

// validate email
const validator = require('validator');
const nodemailer = require('nodemailer');
// Bcruypt
const bcrypt = require('bcrypt');
// JWT
var jwt = require('jsonwebtoken');
// body-parse
var bodyParser = require('body-parser')
//parse application/json
app.use(bodyParser.json())
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

var ObjectId = require('mongoose').Types.ObjectId;

const fs = require("fs"); // file-system
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


function response(code,data,error) {
  if(code == 200){
    return {code, data }
  }
  return {code , error }
}
function ChangeToSlug(title)
{
    var  slug;
 
    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();
 
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    return slug;
}

// set up cấu hình lưu trong Multer
// Multer xử lí các file khi user upload
const cloudinary = require('./lib/cloudinary')
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
    params: { folder: 'uploads',
    format: async (req, file) => {
      const formats = ['jpeg', 'jpg', 'png', 'gif'];
      const fileFormat = path.extname(file.originalname).slice(1);
      return formats.includes(fileFormat) ? fileFormat : 'jpg'; },
    public_id: (req, file) => {
      return file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
      }, }, });
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images') // thư mục lưu tệp
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// })
var upload = multer({ storage: storage })

////////////USERS /////////////

// nhận vào data -> validate nó -> truy vấn cơ sở dữ liệu  bằng create() 
app.post('/api/user/create', upload.single('avatar') , async(req, res) => {
  try {
    let { user_email , user_name , user_password ,  user_phone, user_gender , user_birth, user_address  } = req.body 
    let avatar = req.file
    if(!avatar) return res.send(response(400,'',"Không được để trống ảnh đại diện !"));

    // regular expression  : validate data from response
    if(user_email.trim() == '' || user_name.trim() == '' || user_phone == '' || user_password.trim() == '' || user_birth.trim() == '' || user_gender.trim() == '' || user_address.trim() == ''){
      return res.send(response(400,'',"Không được để trống các Ô !"));
    }
    if (!validator.isEmail(user_email)) {
      return res.send(response(400, '', "Invalid email!"));
    }

    req.body['user_email']    = user_email
    req.body['user_name']     = user_name
    req.body['user_password'] = bcrypt.hashSync(user_password, 10)
    req.body['avatar']        = avatar.filename 
    req.body['sort']    = await users.countDocuments().exec()
    req.body['user_phone']    = user_phone
    req.body['user_gender']   = user_phone
    req.body['user_birth']    = user_birth
    req.body['user_address']  = user_address
    
    const dataUser = await users.create(req.body)
    res.send(response(200 , dataUser))

  } catch (error) {
    if(error.errorResponse) res.send(response(error.errorResponse.code , '' , error.errorResponse.errmsg))
    else console.log(error)
  }

})

//nhận vào 2 tham số email, password -> validate -> truy vấn Db users -> dùng hàm compare() so sánh với mật khẩu và check email -> thông báo login thành công và sau đó cung cấp 1 Token cho người này -> fornt end sex lưu trữ ở trên LocalStorage
app.post('/api/user/login' ,
  async (req,res)=>{  try {
    var { user_email , user_password } = req.body
    if (!validator.isEmail(user_email)) {
      return res.send(response(504, '', "Invalid email!"));
    }
    if(user_email == '' || user_password == '' ){
      return res.send(response(504,'',"Không được để trống các Ô !"))
    }

    const dataUser = await users.find({user_email}).exec()
    console.log(dataUser);
    
    if(dataUser.length == 0){
      return res.send(response(504, '' , 'Cannot find this email!'))
    }
    const ComparePass = bcrypt.compareSync(user_password, dataUser[0].user_password) // true or false
    if(ComparePass !== true){
      return res.send(response(504,'',"Wrong email or password!"))
    }
    dataToken = {
      _id        : dataUser[0]._id,
      user_email : dataUser[0].user_email,
      user_name  : dataUser[0].user_name,
      user_phone : dataUser[0].user_phone,
      user_role  : dataUser[0].user_role,
      sort       : dataUser[0].sort,
      avatar     : dataUser[0].avatar,
      user_birth : dataUser[0].user_birth
    }
    const token = jwt.sign({ data: dataToken }, process.env.SECRETKEY, { expiresIn: '10h' });
    res.send(response(200, token ))
  } catch (error) {
    if(error.errorResponse) res.send(response(error.errorResponse.code , '' , error.errorResponse.errmsg))
    else console.log(error)
  }
})

app.post('/api/user/infor', authentication,
  async (req,res)=>{
    try {
      let userID = req.body["decoded"].data._id
      const userINFOR = await users.findOne( {_id : new mongoose.Types.ObjectId(userID)}).exec()
      res.send(response(200,userINFOR))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)
// 1 hàm checkToken return true or false
app.get('/api/checkToken',
  async (req, res)=>{
    var token = req.headers['authorization']
    if(!token) return res.send(response(404,'',"Fill your Token"))
    token = token.split(" ")[1]
    jwt.verify( token, process.env.SECRETKEY , function(err, decoded) {
      if (err) {
        return res.send(response(401,'',"Token is expired Error."))
      }else{
        return res.send(response(200, decoded))
      }
    }); 
})

app.post('/api/category/create', authentication,
 async (req,res)=>{
  try {    
    let { category_name  , s_descrip, parentCategory  } = req.body
    if(category_name === undefined || category_name.trim() == '' ) return res.send(response(504,'',"Nhập lại Name của Category này!."))
    if(s_descrip === undefined || s_descrip.trim() == '' )         return res.send(response(504,'',"Nhập lại SHort Description của Category này!."))

    req.body['userID']   = req.body["decoded"].data._id       
    req.body['category_name']   = category_name
    req.body['category_slug']   = ChangeToSlug(category_name)
    req.body['parentCategory']    = parentCategory
    req.body['category_short_description']  =  s_descrip

    var dataCategory = await categories.create(req.body)
    // await categories.updateMany(
    //   { },
    //   { $set : 
    //     {
    //       "parentCategory.name": "Thời trang nam",
    //       "parentCategory.img": "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp"
    //     },
    //     // $unset: { category_img: 1 }
    //   },
    //   { new :true }
    // )
    res.send(response(200,dataCategory))
  } catch (e) {
    if(e.errorResponse){
      return res.send(response(e.errorResponse.code,'',e.errorResponse.errmsg))
    }else{
      console.log(e);
    } 
  }
 }
)

app.post('/api/category/getlistCategory' ,
  async (req,res)=>{
    let { Id_seller } = req.body
    var check = ObjectId.isValid(Id_seller)
    if(check === false){
      return res.send(response(504, '' ," KHong phải là ObjectId."))
    }
    const dataCategory = await categories.find({ userID : Id_seller}).select("category_name").exec()
    res.send(response(200 , dataCategory))
 }
)

let category_on_page = 5
app.post('/api/category', authentication,
  async (req,res)=>{
    try {
      let { page = 1 } = req.query // default : pop , or sale , price , time create
      // page = 1 nếu không cung cấp tham số page
      let Id_seller = req.body["decoded"].data._id     

      var check = ObjectId.isValid(Id_seller)
      if(check === false ){
        return res.send(response(504, '' ," KHong phải là ObjectId."))
      }
      const checkExist = await users.findOne({_id : Id_seller}).select("user_name").exec()
      if(checkExist.length == 0){
        return res.send(response(504,"",'KHông có obiectId này!'))
      }

      let listCategory = await categories.aggregate([
        { $match :{ userID : new ObjectId(Id_seller) ,} }, // tại đây, phải có new ObjectId để xác định đây là Id của users mới được, còn không sẽ không ra kết quả nào.
        {
          $project : {
          _id : 1,
          category_name : 1,
          category_img : 1,
          }
        },
        { $skip  : parseInt((page - 1 ) * category_on_page ) },
        { $limit : category_on_page },
      ]).exec()

      const data = {
        listCategory : listCategory,
        dataUser    : checkExist
      }
      res.send(response(200,data))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)
app.post('/api/category/delete' , authentication ,
  async (req,res)=>{
    try {
      let { categoriesID } = req.body
      // check ID  and exist
      var check = ObjectId.isValid(categoriesID)
      if(check === false) return res.send(response(504, '' ," KHong phải là ObjectId.")) 
      const exist_category = await categories.findById( { _id : new mongoose.Types.ObjectId(categoriesID)}).select("_id").exec()
      if(exist_category.length == 0) return res.send(response(504,'','Khong có sản phẩm này.'))

      const deleteCategory = await categories.deleteOne( {_id : new mongoose.Types.ObjectId(categoriesID)}).exec()
      res.send(response(200,"Xóa thành công sản phẩm "))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)

// for seller 
app.post('/api/category/getAllCategory' , authentication,
  async (req,res)=>{
    let  Id_seller  = req.body['decoded'].data._id    
    const dataCategory = await categories.find({userID : new mongoose.Types.ObjectId(Id_seller) }).select("category_name").exec()
    res.send(response(200 , dataCategory))
  }
)

app.post('/api/category/products' ,
  async(req,res)=>{
    try {
      let { search_query_category , sortBy , page = 1 , rating = 0 , detail } = req.body
      let attribute
      let sort_condition

      if(search_query_category.trim() == '' ){
        return res.send(response(504, '' ," Null search_query_category."))
      }
      const listID_category = await categories.find({ 'parentCategory.name': search_query_category }).select("_id").exec()
      let list = []
      for(let ID of listID_category){
        list.push(ID._id)
      } 
      
      if(sortBy == "time_desc"){
        sort_condition = -1 // giảm dần : -1  và tăng dần : 1
        attribute      = "createdAt"
      }else if(sortBy == "sales"){
        sort_condition = -1
        attribute      = "product_sold_quantity"
      }else if(sortBy == "price_asc"){
        sort_condition = 1
        attribute      = "product_supp_price"  
      }else if(sortBy == "price_desc"){
        sort_condition = -1
        attribute      = "product_supp_price"  
      }
      else{
        sort_condition = -1
        attribute      = "product_avg_rating"
      }
      
      let listProduct
      if(detail.name != ''){
        listProduct = await products.aggregate([
          { $match : {
              categories :  { $in : list.map(categories => categories)  }, 
              product_details : {
                $elemMatch : { name : detail.name , value : detail.value }
              },
              product_avg_rating : { $gte : rating },
            }
          },
          {
            $project : {
            _id : 1,
            product_name : 1,
            product_slug : 1,
            product_imgs : 1,
            product_supp_price : 1,
            product_sold_quantity : 1,
            product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
            categories   : 1,
            category_name: 1
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
      }else{
        listProduct = await products.aggregate([
          { $match : {
              categories :  { $in : list.map(categories => categories)  }, 
              product_avg_rating : { $gte : rating },
            }
          },
          {
            $project : {
            _id : 1,
            product_name : 1,
            product_slug : 1,
            product_imgs : 1,
            product_supp_price : 1,
            product_sold_quantity : 1,
            product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
            categories   : 1,
            category_name: 1
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
      }
      res.send(response(200,listProduct))

    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
})

// xem thông tin Seller
var products_on_page = 15
app.post('/api/product/shop',
  async (req,res)=>{
    try {
      let { page = 1  , sortBy } = req.query // default : pop , or sale , price , time create
      // page = 1 nếu không cung cấp tham số page
      let {Id_seller,category_id} = req.body
      let sort_condition 
      let attribute

      var check = ObjectId.isValid(Id_seller)
      if(check === false ){
        return res.send(response(504, '' ," KHong phải là ObjectId."))
      }
      const checkExist = await users.findOne({_id : Id_seller}).select("user_name avatar user_phone user_address createdAt").exec()
      if(checkExist.length == 0){
        return res.send(response(504,"",'KHông có obiectId này!'))
      }

      if(sortBy == "time_desc"){
        sort_condition = -1 // giảm dần : -1  và tăng dần : 1
        attribute      = "createdAt"
      }else if(sortBy == "sales"){
        sort_condition = -1
        attribute      = "product_sold_quantity"
      }else if(sortBy == "price_asc"){
        sort_condition = 1
        attribute      = "product_supp_price"  
      }else if(sortBy == "price_desc"){
        sort_condition = -1
        attribute      = "product_supp_price"  
      }
      else{
        sort_condition = -1
        attribute      = "product_avg_rating"
      }

      let listProduct    
      if(category_id.trim() != ''){      
        listProduct = await products.aggregate([
          { $match :{ userID : new ObjectId(Id_seller) ,categories : new ObjectId(category_id) } }, // tại đây, phải có new ObjectId để xác định đây là Id của users mới được, còn không sẽ không ra kết quả nào.
          {
            $project : {
            _id : 1,
            product_name : 1,
            product_slug : 1,
            product_imgs : 1,
            product_supp_price : 1,
            product_sold_quantity : 1,
            product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
            categories   : 1, // ở đây nếu không lọc ra thì ở dưới _id của $group sẽ bằng null
            category_name: 1
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
      }
      else{
        listProduct = await products.aggregate([
          { $match :{ userID : new ObjectId(Id_seller) ,} }, // tại đây, phải có new ObjectId để xác định đây là Id của users mới được, còn không sẽ không ra kết quả nào.
          {
            $project : {
            _id : 1,
            product_name : 1,
            product_slug : 1,
            product_imgs : 1,
            product_supp_price : 1,
            product_sold_quantity : 1,
            product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
            categories   : 1, // ở đây nếu không lọc ra thì ở dưới _id của $group sẽ bằng null
            category_name: 1
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
      }
      
      const data = {
        listProduct : listProduct,
        dataUser    : checkExist
      }
      res.send(response(200,data))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)

app.post('/api/product/manage', authentication ,
  async (req,res)=>{
    try {
      let { page = 1  , sortBy } = req.query // default : pop , or sale , price , time create
      // page = 1 nếu không cung cấp tham số page
      let { category_id } = req.body
      let sort_condition 
      let attribute
      let Id_seller = req.body['decoded'].data._id 

      // check Object
      var ObjectId = require("mongoose").Types.ObjectId
      var check = ObjectId.isValid(Id_seller)
      if(check === false ){
        return res.send(response(504, '' ," KHong phải là ObjectId."))
      }
      const checkExist = await users.findOne({_id : Id_seller}).select("user_name user_avt_img user_phone user_address createdAt").exec()
      if(checkExist.length == 0){
        return res.send(response(504,"",'KHông có obiectId này!'))
      }

      if(sortBy == "time_desc"){
        sort_condition = -1 // giảm dần : -1  và tăng dần : 1
        attribute      = "createdAt"
      }else if(sortBy == "sales"){
        sort_condition = -1
        attribute      = "product_sold_quantity"
      }else if(sortBy == "price_asc"){
        sort_condition = 1
        attribute      = "product_variants[0].price"
      }else if(sortBy == "price_desc"){
        sort_condition = -1
        attribute      = "product_variants[0].price"
      }
      else{
        sort_condition = -1
        attribute      = "createdAt"
      }

      let listProduct    
      if(category_id != ''){
        listProduct = await products.aggregate([
          { $match :{ userID : new ObjectId(Id_seller) ,categories : new ObjectId(category_id) } }, // tại đây, phải có new ObjectId để xác định đây là Id của users mới được, còn không sẽ không ra kết quả nào.
          {
            $project : {
            _id : 1,
            product_name : 1,
            product_slug : 1,
            product_imgs : 1,
            product_supp_price : 1,
            product_sold_quantity : 1,
            sort         : 1,
            product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
            categories   : 1, // ở đây nếu không lọc ra thì ở dưới _id của $group sẽ bằng null
            category_name: 1
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
      }
      listProduct = await products.aggregate([
        { $match :{ userID : new ObjectId(Id_seller) ,} }, // tại đây, phải có new ObjectId để xác định đây là Id của users mới được, còn không sẽ không ra kết quả nào.
        {
          $project : {
          _id : 1,
          product_name : 1,
          product_slug : 1,
          product_imgs : 1,
          product_supp_price : 1,
          sort         : 1,
          product_sold_quantity : 1,
          product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
          categories   : 1, // ở đây nếu không lọc ra thì ở dưới _id của $group sẽ bằng null
          category_name: 1
          }
        },
        { $sort  : { [attribute]  : sort_condition }} ,
        { $skip  : parseInt((page - 1 ) * products_on_page ) },
        { $limit : products_on_page },
      ]).exec()
        
      const data = {
        listProduct : listProduct,
        dataUser    : checkExist
      }
      res.send(response(200,data))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
})
app.post('/api/product/delete' , authentication,
  async (req,res)=>{
    try {
      let { productId } = req.body
      // check ID  and exist
      var check = ObjectId.isValid(productId)
      if(check === false) return res.send(response(504, '' ," KHong phải là ObjectId.")) 
      const exist_product = await products.findById( { _id : new mongoose.Types.ObjectId(productId)}).select("_id").exec()
      if(exist_product.length == 0) return res.send(response(504,'','Khong có sản phẩm này.'))

      const deleteProduct = await products.deleteOne( {_id : new mongoose.Types.ObjectId(productId)}).exec()
      res.send(response(200,"Xóa thành công sản phẩm "))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)
app.post('/api/product/create', upload.fields([
   {name : "img_product", maxCount : 5},
   {name : "product_variants_img" , maxCount : 7}
  ]),
  authentication,
  async (req, res)=>{
   try {
     let {
       product_name, product_short_description, product_description ,
        categoriesID, product_supp_price,  product_variants, product_details_arr
     } = req.body     
     
     let img_product = req.files['img_product']
     let product_variants_img = req.files["product_variants_img"] 
     
     //let product_variants = JSON.stringify(req.body.product_variants) //if not parse to JSON, it will a String, not a Object Array
     product_variants = JSON.parse(product_variants) //if not parse to JSON, it will a String, not a Object Array
     //let product_details = JSON.stringify(req.body.product_details_arr)
     //  product_details = JSON.parse(product_details)
     product_details = JSON.parse(product_details_arr)     

     if( product_name.trim() == '' || product_short_description.trim() == '' || product_description.trim() == '' || product_supp_price == '' || categoriesID.trim() == ''){
       return res.send(response(504, '' , " Hãy điền vào các trường thông tin ."))
     }
     if(product_details.length === 0){
       return res.send(response(504, '' , " Hãy thêm ít nhất 1 thuộc tính riêng cho sản phẩm này."))
     }

     product_imgs = []
     for( let [index,image] of img_product.entries()){
      let object = {
        link : image.path,
        alt  : image.filename
      }
      product_imgs.push(object)
     }
    
    // per image, will 
    product_variants_img_arr = []
    for(let [index,file] of product_variants_img.entries()){
      let product_imgs_object = {
        alt  : file.path,
        link : file.filename
      } 
      product_variants_img_arr.push(product_imgs_object)
      product_variants[index]["variant_imgs"] = product_variants_img_arr
    }
     // check ID    
     var categoryCheck = ObjectId.isValid(categoriesID)
     if(categoryCheck === false){
       return res.send(response(504, '' ," KHong phải là ObjectId."))
     }
 
     const checkCategories = await categories.findOne({_id : new mongoose.Types.ObjectId(categoriesID)}).select("category_name").exec()
     if(checkCategories.length == 0) { return res.send(response(504,'' , " không có category này."))}     
 
     if (!Array.isArray(product_variants)) {      
       return res.send(response(504,'' , " product_variants không phải là 1 array."))
     }
     for(let element of product_variants){
      element.variant_slug = await ChangeToSlug(element.variant_name);
    }
 
     const data = {
       product_name : product_name,
       product_slug : ChangeToSlug(product_name),
       product_imgs : product_imgs,
       product_short_description : product_short_description,
       product_description       : product_description,
       product_details           : product_details,
       product_variants          : product_variants,
       sort        :  await products.countDocuments().exec() ,
       userID        :  new mongoose.Types.ObjectId(req.body['decoded'].data._id ) , // thuộc về người sở hữu, người tạo ra sản phẩm này
       categories          : new mongoose.Types.ObjectId(checkCategories._id), 
       category_name       : checkCategories.category_name,               // khi truy vấn thì ko cần truy vấn tới Collection khác, tăng truy vấn tại đây
       product_supp_price  : product_supp_price,
     }   

     const dataProduct = await products.create(data)
     res.send(response(200,dataProduct))
   } catch (e) {
     if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
     else console.log(e)
   }
  }
 
)
app.post('/api/product/update', 
  upload.fields([
   {name : "img_product", maxCount : 12},
   {name : "product_variants_img" , maxCount : 12}
  ]),
  authentication,
  async (req, res)=>{
   try {
     let {
      product_id ,product_name, product_short_description, product_description ,
      product_variants,  categoriesID, product_supp_price, product_details
     } = req.body
     
     let img_product = req.files['img_product']
     let product_variants_img = req.files["product_variants_img"]
 
     if( product_name.trim() == '' || product_short_description.trim() == '' || product_description.trim() == '' || product_supp_price == '' || categoriesID.trim() == ''){
       return res.send(response(504, '' , " Hãy điền vào các trường thông tin ."))
     }
     if(product_details.length === 0){
       return res.send(response(504, '' , " Hãy thêm ít nhất 1 thuộc tính riêng cho sản phẩm này."))
     }
     
     product_variants = JSON.parse(req.body.product_variants) //if not parse to JSON, it will a String, not a Object Array
     product_details = JSON.parse(req.body.product_details)
     
     product_imgs = []
     img_product.forEach((file,index) =>{
       product_imgs.push({
         link : img_product[index].path,
         alt  : img_product[index].filename
       })
     })
     
     var categoryCheck = ObjectId.isValid(categoriesID)
     var productCheck = ObjectId.isValid(product_id)
     if(categoryCheck === false || productCheck === false){
       return res.send(response(504, '' ," KHong phải là ObjectId."))
     }
 
     const checkCategories = await categories.findOne({_id : new mongoose.Types.ObjectId(categoriesID)}).select("category_name").exec()
     const checkProduct = await products.findOne({_id : new mongoose.Types.ObjectId(product_id)}).select("_id sort").exec()
     if(checkCategories.length == 0 ||  checkProduct.length == 0) { return res.send(response(504,'' , " không có sản phẩm hoặc category này."))}
 
     if (!Array.isArray(product_variants)) {
       return res.send(response(504,'' , " product_variants không phải là 1 array."))
     }
     product_variants.forEach(element => {
       element.variant_slug = ChangeToSlug(element.variant_name);
     });

     const data = {
       product_name : product_name,
       product_slug : ChangeToSlug(product_name),
       product_imgs : product_imgs,
       product_short_description : product_short_description,
       product_description       : product_description,
       product_details           : product_details,
       product_variants          : product_variants,
       sort        :  checkProduct.sort ,
       userID        :  req.body['decoded'].data._id  , // thuộc về người sở hữu, người tạo ra sản phẩm này
       categories          : new mongoose.Types.ObjectId(checkCategories._id), 
       category_name       : checkCategories.category_name,               // khi truy vấn thì ko cần truy vấn tới Collection khác, tăng truy vấn tại đây
       product_supp_price  : product_supp_price,
     }         
     const dataProduct = await products.updateOne( {_id : new mongoose.Types.ObjectId(product_id)} , data ,{new : true}) // UpdateOne(filter,data_update,option)
     res.send(response(200,"Thành công update"))
   } catch (e) {
     if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
     else console.log(e)
   }
  }
 
)


//Delete this 
app.post('/api/product/listProduct', authentication,
 async (req,res)=>{
  try {
    let user_id = req.body['decoded'].data._id 
    let { sortBy } = req.query 
    var page = 1
    var sort_condition
    var attribute
    
    if(sortBy == "time_desc"){
      sort_condition = -1 // giảm dần : -1  và tăng dần : 1
      attribute      = "createdAt"
    }else if(sortBy == "sales"){
      sort_condition = -1
      attribute      = "product_sold_quantity"
    }else if(sortBy == "price_asc"){
      sort_condition = 1
      attribute      = "product_variants[0].price"
    }else if(sortBy == "price_desc"){
      sort_condition = -1
      attribute      = "product_variants[0].price"
    }
    else{
      sort_condition = -1
      attribute      = "product_avg_rating"
    }

    const data = await products.aggregate([
      { $match : { userID : new mongoose.Types.ObjectId(user_id) }},
      { $project : {
        _id : 1 ,
        product_name : 1 ,
        product_imgs : 1,
        product_avg_rating : 1, // :1 nghĩa là sẽ lấy , :0 sẽ không lấy
        category_name   : 1 
      }},
      { $sort  : { [attribute] : sort_condition} },
      { $skip  : parseInt((page-1) * products_on_page)},
      { $limit : products_on_page}
    ]).exec()

    res.send(response(200,data))
  } catch (e) {
    if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
    else console.log(e)
  }
 }
)
// get By product ID : Detail_product
app.post('/api/product',
  async(req,res)=>{
    try {
      let { productId } = req.body
      // check ObjectId
      var productCheck = ObjectId.isValid(productId)
      if(productCheck === false){
      return res.send(response(504, '' ," KHong phải là ObjectId."))
      }
      const product_detail = await products.findOne({ _id : productId})
      .populate(
        { path   : "userID" ,
          select : "user_name avatar createdAt"
        }) 
        // populate thêm phần review
      .exec()
      res.send(response(200,product_detail))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
  }
)



app.post('/api/user/cart', authentication,
 async (req,res) =>{
  try {
    var userID = req.body["decoded"].data._id; 
    
    var check = ObjectId.isValid(userID);
    if (check == false) {
      return res.send(response(504, '', 'Không phải là ObjectId'));
    }
  
    const checkExist = await users.find({ _id: new mongoose.Types.ObjectId(userID) })
      .select("cart")
      .populate({
        path: 'cart.product',
        select: 'product_name product_slug product_imgs product_variants._id product_variants.variant_name product_variants.price product_variants.variant_imgs userID categories',
        populate: { path: 'userID', select: 'user_name', strictPopulate: false },
        strictPopulate: false
      })
      .lean()
      .exec();

    for (let index = 0; index < checkExist[0].cart.length; index++) {
      // Create a deep copy of the current cart item
      let currentElement = JSON.parse(JSON.stringify(checkExist[0].cart[index])); 
      
      let variantID = currentElement.variant_id.toString();
      console.log("Variant ID:", variantID);
      
      let originalVariants = currentElement.product.product_variants;
      currentElement.product.product_variants = originalVariants.filter(variant => {
        console.log("Comparing:", variant._id.toString(), "with", variantID);
        return variant._id.toString() === variantID;
      });
      // Update the cart with the modified item
      checkExist[0].cart[index] = currentElement;
    }
    console.log("Final Cart:", checkExist[0].cart);  
    // Here, have a problem that when you handle element in loop 1, you was used this array after filter to Filter in next loop.
    // so that we need to create a copy the current cart to handle in this, not handle to the current cart 
    
    return res.send(response(200, checkExist));
  } catch (error) {
    if (error.errorResponse) {
      return res.send(response(error.errorResponse.code, '', error.errorResponse.errmsg));
    } else {
      console.log(error);
    }
  }
  
 }
)
// lúc thêm vào giỏ, cần chính xác productId và variantId đó
app.post('/api/user/cart/create', authentication,
 async (req,res) =>{
  try {
    var userID  = req.body["decoded"].data._id 
    var { product , variant_id, quantity } = req.body // productId and variant_id
 
    if(variant_id.trim() == '' || product.trim() == ''){
      return res.send(response(204,'','Hãy chọn phân loại của sản phẩm'))
    }
    var check1 = ObjectId.isValid(product)
    var check2 = ObjectId.isValid(variant_id)
    if( check1==false || check2 == false){
      return res.send(response(504,'','Không phải là ObjectId'))
    }

    const productInCart = await users.findOne(
      {
      _id: new mongoose.Types.ObjectId(userID),
      'cart.product'   : new mongoose.Types.ObjectId(product),
      'cart.variant_id': new mongoose.Types.ObjectId(variant_id)
      }).select('cart').exec();

    if(productInCart === null){
      // add to Cart
      await users.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(userID) },
        {
          $push : {         // $push được mongoose hỗ trợ để thao tác với mảng => nên dùng 
            cart : {
              product    : new mongoose.Types.ObjectId(product),
              variant_id : new mongoose.Types.ObjectId(variant_id),
              quantity   : quantity,
            }
          }
        }
      ).exec()
      return res.send(response(200,'Thêm vào giỏ hàng thành công'))
    }else{
      // count + 1
      await users.findOneAndUpdate(
        {
          _id  : new mongoose.Types.ObjectId(userID), 
          'cart.product' : new mongoose.Types.ObjectId(product)
        },
        {
          $inc : { 'cart.$.quantity' : quantity }
          /* 
            sử dụng để tăng hoặc giảm giá trị của một trường số học
            số n : + n , tăng n giá trị
            số âm : -n , giảm n giá trị
          */
        }
      ).exec()
      return res.send(response(200,'Cộng vào giỏ hàng thành công + 1.'))
    }
  } catch (error) {
    if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
    else console.log(error);
  }
 }
)
app.post('/api/user/cart/delete', authentication,
 async (req,res) =>{
  try {
    var userID  = req.body["decoded"].data._id 
    var { product , variant_id } = req.body

    var ObjectId = require("mongoose").Types.ObjectId
    var check1 = ObjectId.isValid(product)
    if(check1 == false){
      return res.send(response(504,'','Không phải là ObjectId'))
    }
    var check2 = ObjectId.isValid(variant_id)
    if(check2 == false){
      return res.send(response(504,'','Không phải là ObjectId'))
    }


    const deleteInCart = await users.findOneAndUpdate(
        { _id  : new mongoose.Types.ObjectId(userID) }, 
        { $pull  : { // $pull dùng xóa 1 phần tử khỏi 1 mảng
          cart : {
            product : new mongoose.Types.ObjectId(product),
            variant_id : new mongoose.Types.ObjectId(variant_id)    
          }
        }},
        { new: true } // Tùy chọn này trả về tài liệu sau khi cập nhật

    ).exec()
    return res.send(response(200,"Xóa thành công"))
/*
    +Nếu xóa thành công:
      Hàm sẽ trả về tài liệu người dùng trước khi phần tử trong mảng cart bị xóa.
      Nếu bạn muốn nhận tài liệu sau khi cập nhật, bạn có thể sử dụng tùy chọn { new: true }.
    +Nếu không xóa được hoặc không có phần tử để xóa:
      Hàm sẽ trả về null nếu không tìm thấy tài liệu nào khớp với điều kiện truy vấn.
*/
  } catch (error) {
    if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
    else console.log(error);
  }
 }
)

app.post('/api/user/cart/update', authentication ,
  async (req,res) =>{
    try {
      let userID  = req.body["decoded"].data._id 
      let { quantity, product_id, variant_id } = req.body
      const update_quantity_cart = await users.findOneAndUpdate(
      {_id : userID, 'cart.product' : product_id, 'cart.variant_id' : variant_id },
      { $set : {"cart.$.quantity" : parseInt(quantity)} },
      {new : true}
      ) 
    res.send(response(200,"Successfull"))      
  } catch (error) {
    if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
    else console.log(error);
  }
})



app.post('/api/orders/create', authentication,
  async (req,res)=>{
    try {
      let customer_id  = req.body["decoded"].data._id 
      let {
        staff_id,order_total_cost,order_buyer,order_address,
        order_details,order_shipping_cost,order_payment_cost,order_status
      } = req.body

      if( order_address.trim() == '' || order_buyer.trim() == '' || order_status.trim() == '' ){
        return res.send(response(504, '' , " Hãy điền vào các trường thông tin ."))
      }
      if(!Array.isArray(order_details)){
        return res.send(response(504, '' , " Hãy điền lai các trường thông tin ."))
      }
      var check = ObjectId.isValid(staff_id)
      if(check == false){
        return res.send(response(504,'','Không phải là ObjectId'))
      }
      const findSeller = await users.findOne({_id : staff_id}).select("").exec()
      if(findSeller.length == 0){
        return res.send(response(504,'','Không có Seller này.'))
      }

      req.body["customer_id"] = customer_id
      const newOrders = await orders.create(req.body)
      res.send(response(200,newOrders))
      
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)
app.post('/api/orders/deleteCart', authentication,
  async (req,res)=>{
    try {
      let user_id  = req.body["decoded"].data._id 
      const findSeller = await users.updateOne(
        {_id : new mongoose.Types.ObjectId(user_id)},
        { $set :{cart : []} }
      ) 
      .select("_id").exec()
      res.send(response(200,findSeller)) 
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)

// get list khi chưa đánh giá , và sau khi đánh giá
app.post('/api/orders/getList', authentication,
  async (req,res)=>{
    try {
      let customer_id  = req.body["decoded"].data._id 
      let { page = 1 , order_status }  = req.body // Successfull,Processing
      let order_status_array = ["Ordered" , "Shipping" , "Processing" ]
 
      let listOrders 
      if(order_status == 'Successfull' ){
        listOrders = await orders.aggregate([
          {$match :
             {customer_id : new mongoose.Types.ObjectId(customer_id),
              order_status : order_status 
             }},
          {$project : {
            _id          : 1,
            order_status : 1,
            order_details: 1,
            order_payment_cost : 1,
            createdAt    : 1,
            updatedAt    : 1
          }},
          { $sort  : { createdAt : -1 }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
        res.send(response(200,listOrders))
      }else{
        listOrders = await orders.aggregate([
          {$match :
            {
              customer_id : new mongoose.Types.ObjectId(customer_id), 
              order_status : { $in :  order_status_array.map(order_status => order_status)  }
            }
          },
          {$project : {
            _id          : 1,
            order_status : 1,
            order_details: 1,
            order_payment_cost : 1,
            createdAt    : 1,
            updatedAt    : 1
          }},
          { $sort  : { createdAt : -1 }} ,
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page },
        ]).exec()
        res.send(response(200,listOrders))
      }
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)
app.post('/api/orders/manage', authentication,
  async (req,res)=>{
    try {
      let { page = 1  , sortBy  } = req.query // default : pop , or sale , price , time create
      let { status } = req.body
      let Id_seller = req.body['decoded'].data._id 
      const checkExist = await users.findOne({_id : Id_seller}).select("_id").exec()
      if(checkExist.length == 0){
        return res.send(response(504,"",'KHông có obiectId này!'))
      }

      if(sortBy == "time_asc"){
        sort_condition = 1 // giảm dần : -1  và tăng dần : 1
        attribute      = "createdAt"
      }else if(sortBy == "price_asc"){
        sort_condition = 1
        attribute      = "order_payment_cost"
      }else if(sortBy == "price_desc"){
        sort_condition = -1
        attribute      = "order_payment_cost"
      }
      else{
        sort_condition = -1
        attribute      = "createdAt"
      }

      let listORDERS 
      if(status.trim() != ''){
        listORDERS = await orders.aggregate([
          { $match :{ staff_id : new ObjectId(Id_seller) , order_status : status } }, 
          {
            $project : {
            _id : 1,
            customer_id : 1,
            staff_id    : 1,
            order_buyer : 1,
            order_total_cost : 1 ,
            order_shipping_cost : 1 ,
            order_payment_cost : 1,
            order_status : 1,
            createdAt    : 1,
            }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * 6 ) },
          { $limit : 6 },
        ]).exec()
      }else{
        listORDERS = await orders.aggregate([
          { $match :{ staff_id : new ObjectId(Id_seller) } }, 
          {
            $project : {
            _id : 1,
            customer_id : 1,
            staff_id    : 1,
            order_buyer : 1,
            order_total_cost : 1 ,
            order_shipping_cost : 1 ,
            order_payment_cost : 1,
            order_status : 1,
            createdAt    : 1,
          }
          },
          { $sort  : { [attribute]  : sort_condition }} ,
          { $skip  : parseInt((page - 1 ) * 6 ) },
          { $limit : 6 },
        ]).exec()
      }
      res.send(response(200,listORDERS))
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
})

app.post('/api/orders/manage/update', authentication,
  async (req,res)=>{
    try {
      let { status , order_id } = req.body
      let Id_seller = req.body['decoded'].data._id 
      const checkExist = await users.findOne({_id : Id_seller}).select("_id").exec()
      if(checkExist.length == 0){
        return res.send(response(504,"",'KHông có obiectId này!'))
      }

      if(status.trim() != ''){
        let orderAfter_update = await orders.findOneAndUpdate(
          { _id : new mongoose.Types.ObjectId(order_id) },
          { $set : { order_status : status  } },
          { new : true }
        ).exec()
        res.send(response(200,orderAfter_update))
      }
    } catch (e) {
      if(e.errorResponse)  return res.send(response(e.errorResponse.code,'' , e.errorResponse.errmsg))
      else console.log(e)
    }
})

app.post('/api/orders/detailForSeller', authentication,
  async (req,res)=>{
    try {
      let { orders_ID }  = req.body 
      const detailOrder = await orders.findOne({_id : orders_ID}).exec()
      res.send(response(200,detailOrder))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)


// đừng đụng tới 
app.post('/api/ttt',
  async (req,res)=>{
    try {
      let { product_id,variant_id }  = req.body 
      const productsInfor = await products
      .findOne({_id : new mongoose.Types.ObjectId(product_id)})
      .select("_id product_name product_sold_quantity product_variants sort userID categories category_name createdAt")
      .exec()
      productsInfor.product_variants = productsInfor.product_variants.filter(element => { return element._id.toString() === variant_id;})
      
      res.send(response(200,productsInfor))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)
app.post('/api/orders/detail', authentication,
  async (req,res)=>{
    try {
      let customer_id  = req.body["decoded"].data._id 
      let { orders_ID }  = req.body //Paginagation
      const detailOrder = await orders.findOne({_id : orders_ID}).exec()
      res.send(response(200,detailOrder))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)


app.post('/api/reviews/create', upload.array('review_image',5), authentication,
  async (req,res)=>{
    try {
      let user_id  = req.body["decoded"].data._id 
      let user_sort = req.body["decoded"].data.sort
      let review_image = req.files
      // console.log(req.body);
      // // return
      let {
        // review_imgs is a Array Object 
        product_id,product_variants_id,order_id,review_rating,review_context,
      } = req.body

      if( product_id.trim() == '' || product_variants_id.trim() == '' || order_id.trim()=='' || review_context.trim() == ''){
        return res.send(response(504, '' , " Hãy điền vào các trường thông tin ."))
      }
      var check = ObjectId.isValid(product_id)
      var check1 = ObjectId.isValid(product_variants_id)
      var check2 = ObjectId.isValid(order_id)
      if(check == false || check1 == false || check2 == false){
        return res.send(response(504,'','Không phải là ObjectId'))
      }

      const product_detail = await products.findOne({_id : new mongoose.Types.ObjectId(product_id)}).select("_id product_name sort product_variants").exec()
      product_detail.product_variants = product_detail.product_variants.filter(element => {
        return element._id.toString() === product_variants_id;
      })

      // product_variants_name
      user_infor = {
        user_name   : req.body["decoded"].data.user_name,
        user_avatar : req.body["decoded"].data.avatar
      }
      // review_imgs
      review_imgs = []
      review_image.forEach(element =>{
        const image = {
          link : element.path ,
          alt  : element.filename ,
        }
      review_imgs.push(image)
      })

      req.body["product_id"] = product_id
      req.body["product_variants_id"] = product_variants_id
      req.body["user_id"] = user_id
      req.body["order_id"] = order_id
      req.body["variant_name"] = product_detail.product_name + product_detail.product_variants[0].variant_name
      req.body["user_infor"] = user_infor
      req.body["review_rating"] = parseInt(review_rating) 
      req.body["review_context"] = review_context
      req.body["review_imgs"] = review_imgs
      req.body["user_sort"] = parseInt(user_sort)
      req.body["product_sort"] = product_detail.sort

      const newReviews = await reviews.create(req.body)
      const ordersUpdate = await orders.findOneAndUpdate(
        {_id : new mongoose.Types.ObjectId(order_id)},
        { order_status : "Successfull" , updatedAt : new Date() }
      ).exec()

      const updateRating = await reviews.find({product_id : new mongoose.Types.ObjectId(product_id)}).select("review_rating").exec()
      const totalRating = updateRating.reduce( (sum,currentvalue) => {
        return sum + currentvalue.review_rating
      },0)

      const average = totalRating / updateRating.length

      const addReview = await
      products.findOneAndUpdate(
        { _id : product_id },
        {
          $push : { recent_reviews : 
            {
              review_id      : newReviews._id,
              variant_name   : req.body["variant_name"],
              user_infor     : user_infor,
              review_rating  : parseInt(review_rating) ,
              review_context : review_context,
              review_imgs    : review_imgs,
              review_date    : newReviews.createdAt
            } 
          },
          $inc  : { // + 1
            review_count : 1,
            product_sold_quantity : 1
           },
          product_avg_rating : average
        },
        { new : true}
      )
      
      if(addReview.recent_reviews.length > 5){
        await products
        .updateOne(
           { _id : new mongoose.Types.ObjectId(product_id) },
           [ { $set : { recent_reviews : { $slice: ["$recent_reviews", -5] } } } ] ,
           { new : true}
          )
      }
      res.send(response(200,newReviews)) 
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)
app.post('/api/reviews/getList',
  async (req,res)=>{
    try {
      let { page = 1, product_id }  = req.body //Paginagation
      reviews_on_page = 5

      const listReviews = await reviews.aggregate([
        {$match : {product_id : new mongoose.Types.ObjectId(product_id)}},
        {$project : {
          _id            : 1,
          product_id     : 1,
          user_infor     : 1,
          review_rating  : 1,
          review_context : 1,
          review_imgs    : 1 ,
          createdAt      : 1,
        }},
        { $sort  : { review_rating : -1 }} ,
        { $skip  : parseInt((page - 1 ) * reviews_on_page ) },
        { $limit : reviews_on_page },

      ]).exec()
      res.send(response(200,listReviews))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)
app.post('/api/reviews/update',
  async (req,res)=>{
    try {
      let { order_id, order_detail_id }  = req.body 

      const listReviews = await orders.findOneAndUpdate(
        { _id : new mongoose.Types.ObjectId(order_id)},
        { $pull : { order_details : { _id : new mongoose.Types.ObjectId(order_detail_id) } } }
      ).exec()
      res.send(response(200,listReviews))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
  }
)



app.post('/api/products/search',
  async(req,res)=>{
    try {
      let { search_query,sortBy,page = 1  } = req.query
      let { rating = 0 , detail }  = req.body
      let sort_condition
      let attribute
      sortBy.trim()

      if(sortBy == "time_desc"){
        sort_condition = -1 // giảm dần : -1  và tăng dần : 1
        attribute      = "createdAt"
      }else if(sortBy == "sales"){
        sort_condition = -1
        attribute      = "product_sold_quantity"
      }else if(sortBy == "price_asc"){
        sort_condition = 1
        attribute      = "product_supp_price"  
      }else if(sortBy == "price_desc"){
        sort_condition = -1
        attribute      = "product_supp_price"  
      }
      else{
        sort_condition = -1
        attribute      = "product_avg_rating"
      }

      let searching
      if(detail.name != ''){
        searching = await products.aggregate([
          { $match : 
            {
              $text: { $search: search_query },
              product_details : {
                $elemMatch : { name : detail.name , value : detail.value }
              },
              product_avg_rating : { $gte : rating}
            } 
          },
          { $project :  {
            _id                    : 1,
            product_name           : 1,
            product_sold_quantity  : 1,
            product_avg_rating     : 1,
            product_imgs           : 1,
            review_count           : 1,
            product_supp_price     : 1,
            score: { $meta: "textScore" }
          }},
          { $sort  : { [attribute]  : sort_condition , score : {$meta : "textScore"}}} , // Trường score: Thêm trường score để lưu trữ điểm số tìm kiếm văn bản từ MongoDB.
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page } 
        ]).exec()
      }
      else{
        searching = await products.aggregate([
          { $match : 
            {
              $text: { $search: search_query },
              product_avg_rating : { $gte : rating}
            } 
          },
          { $project :  {
            _id                    : 1,
            product_name           : 1,
            product_sold_quantity  : 1,
            product_avg_rating     : 1,
            product_imgs           : 1,
            review_count           : 1,
            product_supp_price     : 1,
            score: { $meta: "textScore" }
          }},
          { $sort  : { [attribute]  : sort_condition , score : {$meta : "textScore"}}} , // Trường score: Thêm trường score để lưu trữ điểm số tìm kiếm văn bản từ MongoDB.
          { $skip  : parseInt((page - 1 ) * products_on_page ) },
          { $limit : products_on_page } 
        ]).exec()
      }

      res.send(response(200, searching))
    } catch (error) {
      if(error.errorResponse) return res.send(response(error.errorResponse.code,'', error.errorResponse.errmsg))
      else console.log(error);
    }
})


app.get('/api/products/recommendToken', authentication,
  async (req, res) => {
    try {
        let sortUser = req.body["decoded"].data.sort
        let path = "http://127.0.0.1:5000/api/model_cola";
        let queryObj = { "num_recommender": 17 , "user_index" : sortUser };
        let arrayProduct = [];

        // Sử dụng await để đợi axios.post hoàn thành
        const responsee = await axios.post(path, queryObj);
        arrayProduct = responsee.data.recommend_items;
        // console.log(arrayProduct);
        const recommend = await products.aggregate([
          {
            $match: { sort : { $in: arrayProduct.map(sort => sort) } }
          },
          {
            $project: {
              _id: 1,
              product_name: 1,
              product_slug : 1,
              product_sold_quantity: 1,
              product_avg_rating: 1,
              product_imgs: 1,
              review_count: 1,
              product_supp_price: 1,
            }
          },
        ]).exec();
        // console.log(recommend.length);

        res.send(response(200, recommend));
    } catch (error) {
      if (error.errorResponse) return res.send(response(error.errorResponse.code, '', error.errorResponse.errmsg));
      else console.log(error);
    }
  }
);
app.get('/api/products/recommend',
  async (req, res) => {
    try {
        let path = "http://127.0.0.1:5000/api/rank_base";
        let queryObj = { "n_product": 20 };
        let arrayProduct = [];
        const responsee = await axios.post(path, queryObj);
        arrayProduct = responsee.data.data;
        // console.log(arrayProduct);
        const recommend = await products.aggregate([
          {
            $match: { sort : { $in: arrayProduct.map(sort => sort) } }
          },
          {
            $project: {
              _id: 1,
              product_name: 1,
              product_slug : 1,
              product_sold_quantity: 1,
              product_avg_rating: 1,
              product_imgs: 1,
              review_count: 1,
              product_supp_price: 1,
            }
          },
        ]).exec();
        res.send(response(200, recommend));
    } catch (error) {
      if (error.errorResponse) return res.send(response(error.errorResponse.code, '', error.errorResponse.errmsg));
      else console.log(error);
    }
  }
);


app.get('/api/create_csv', async (req, res) => {
  try {
    // Giả sử `reviews` là model đã được định nghĩa
    const review_data = await reviews.find({}).select("user_sort product_sort review_rating").exec();

    // Bước 1: Tạo đối tượng để lưu trữ tổng số đánh giá và số lượng đánh giá cho từng cặp user_id và product_id
    const ratingsMap = {};

    review_data.forEach(entry => {
      const key = `${entry.user_sort}-${entry.product_sort}`;
      if (!ratingsMap[key]) {
        ratingsMap[key] = {
          user_id: entry.user_sort,
          product_id: entry.product_sort,
          totalRating: 0,
          count: 0
        };
      }
      ratingsMap[key].totalRating += entry.review_rating;
      ratingsMap[key].count += 1;
    });

    // Bước 2: Tạo dữ liệu duy nhất với giá trị trung bình của các đánh giá trùng lặp
    const uniqueData = Object.values(ratingsMap).map(entry => ({
      user_id: entry.user_id,
      product_id: entry.product_id,
      rating: entry.totalRating / entry.count
    }));

    // Bước 3: Ghi dữ liệu vào tệp CSV
    const csvWriter = createCsvWriter({
      path: 'data.csv',
      header: [
        { id: 'user_id', title: 'user_id' },
        { id: 'product_id', title: 'product_id' },
        { id: 'rating', title: 'rating' }
      ]
    });

    await csvWriter.writeRecords(uniqueData);
    console.log('Data saved to data.csv');

    res.send(response(200, uniqueData));
  } catch (error) {
    console.error(error);
    if (error.errorResponse) return res.send(response(error.errorResponse.code, '', error.errorResponse.errmsg));
  }
});

  
