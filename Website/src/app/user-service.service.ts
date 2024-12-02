import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private url = 'http://localhost:3000/api/';

  constructor(
    private http : HttpClient
  ) { }

  // cau hinh Headers
  options = { headers : new HttpHeaders().set("Content-Type" , "application/json") }

  user_register(formData : FormData) : Observable<any>{
    const api = 'user/create'
    return this.http.post(this.url + api, formData) // post (api_name , data , option_headers)
  }

  user_information(token:string){
    const api = "user/infor"
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api,'',requestOptions)
  }

  user_login(user_email:any, user_password:any) : Observable<any>{
    const api = 'user/login'
    const body = {
      "user_email" : user_email,
      "user_password" : user_password
    }
    return this.http.post(this.url + api, body, this.options)
  }

  user_cart(token:string):Observable<any>{
    let api = 'user/cart'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, '' , requestOptions)
  }

  update_cart(quantity:Number,product_id:string,variant_id:string,token:string):Observable<any>{
    let api = 'user/cart/update'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    let objectData={
      quantity   :quantity,
      product_id :product_id,
      variant_id :variant_id
    }
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, objectData, requestOptions)
  }

  // token ; product; variant_id
  add_cart(quantity:Number,product_id:string,variant_id:string,token:string):Observable<any>{
    let api = 'user/cart/create'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    let objectData ={
      quantity   : quantity,
      product    : product_id,
      variant_id : variant_id
    }
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, objectData, requestOptions)
  }
  create_order(data:any,token:string):Observable<any>{
    let api = 'orders/create'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api,data , requestOptions)
  }

  getListOrder_for_Admin(token:string,page:number,sortBy:string,status:string):Observable<any>{
    let api = `orders/manage?page=${page}&sortBy=${sortBy}`
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    let objectData ={
      status : status
    }
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, objectData, requestOptions)
  }
  detailOrder_for_Admin(token:string,orders_ID:string):Observable<any>{
    let api = 'orders/detailForSeller'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    let objectData ={
      orders_ID : orders_ID
    }
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, objectData, requestOptions)
  }
  update_statusOrder_for_Admin(token :string, order_id:string , status:string):Observable<any>{
    const api = 'orders/manage/update'
    let objectData ={
      status   : status,
      order_id : order_id
    }
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, objectData, requestOptions)
  }


  delete_order_cart(token:string):Observable<any>{
    let api = 'orders/deleteCart'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api,'', requestOptions)
  }



  shop_detail(Id_seller:string,page:Number,sortBy:string,category_id:string):Observable<any>{
    let api = `product/shop?page=${page}&sortBy=${sortBy}`
    const body = {
      category_id : category_id,
      Id_seller   : Id_seller
    }
    return this.http.post(this.url + api, body, this.options)
  }

  shop_manage(token:string,page:Number,sortBy:string,category_id:string):Observable<any>{
    let api = `product/manage?page=${page}&sortBy=${sortBy}`
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, {category_id}, requestOptions)
  }


  //getList Order
  getList_order(token:string,page:number,order_status:string):Observable<any>{
    let api = 'orders/getList'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token,
      "Content-Type" : "application/json"
    })
    const data = {
      page :page,
      order_status : order_status
    }
    const requestOptions = {headers :header}
    return this.http.post(this.url + api,data , requestOptions)
  }
  getList_order_filter(product_id:string,variant_id:string):Observable<any>{
    let api = 'ttt'
    let objectData = {
      product_id : product_id,
      variant_id : variant_id
    }
    return this.http.post( this.url + api, objectData , this.options)
  }
  

  // for user
  getlistCategory(Id_seller:string):Observable<any>{
    const api = 'category/getlistCategory'
    return this.http.post(this.url + api, {Id_seller}, this.options)
  }
  getAllCategory(token:string):Observable<any>{
    const api = 'category/getAllCategory'
    const headers = new HttpHeaders({
      "Authorization" : "Bearer " + token
    })
    const requestOptions = { headers : headers}
    return this.http.post(this.url + api, '', requestOptions)
  }

  getListProduct_byCategory(search_query_category : string , sortBy :string, page:number,rating:number,detail:any):Observable<any>{
    let api = 'category/products'
    const object = {
      search_query_category  : search_query_category,
      sortBy : sortBy,
      page   : page,
      rating : rating,
      detail : detail
    }
    return this.http.post(this.url + api, object,this.options)
  }

  // for seller
  getlistCategoryByToken(token:string,page:number):Observable<any>{
    const api = `category?page=${page}`
    const headers = new HttpHeaders({
      "Authorization" : "Bearer " + token
    })
    const requestOptions = { headers : headers}
    return this.http.post(this.url + api,'',requestOptions)
  }
  delete_category(categoriesID:string,token:string):Observable<any>{
    let api = 'category/delete'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, {categoriesID}, requestOptions)
  }


  create_review(formData:FormData,token :string):Observable<any>{
    let api = 'reviews/create'
    let header = new  HttpHeaders({
      'Authorization': "Bearer "  + token
    })
    const requestOptions = {headers :header}
    return this.http.post(this.url + api, formData , requestOptions)
  }
  

  searching(search_query:string,sortBy:string,page:number, rating:number , detail:any):Observable<any>{
    const api =`products/search?search_query=${search_query}&sortBy=${sortBy}&page=${page}`
    const body ={
      rating: rating ,
      detail:detail
    }
    return this.http.post(this.url + api, body, this.options)
  }

  recommender(token:string):Observable<any>{
    let api = "products/recommend" 
    if(token.trim() != ''){
      let api1 = "products/recommendToken" 
      let header = new  HttpHeaders({
        'Authorization': "Bearer "  + token
      })
      const requestOptions = {headers :header}
      return this.http.get(this.url + api1, requestOptions)
    }else{
      return this.http.get(this.url + api, this.options)
    }
  }
}
