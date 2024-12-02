import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';



@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(
    private http : HttpClient,
  ) { }

    // call api seller
    private url = 'http://localhost:3000/api/'

    options = { headers : new HttpHeaders().set("Content-Type" , "application/json") }

    delete_product(productId:any) : Observable<any>{
      let api = 'product/delete'
      return this.http.post(this.url + api,productId)
    }
    create_product(formdata:FormData,token:String) : Observable<any>{
      let api = 'product/create'
      const headers = new HttpHeaders({
        'Authorization': "Bearer "  + token
      });
      const requestOptions = { headers: headers };
      return this.http.post(this.url + api, formdata, requestOptions)
    }
    update_product(formData:FormData) : Observable<any>{
      let api = 'product/update'
      return this.http.post(this.url + api, formData)
    }
    // list_product()
    detail_product(productId:string): Observable<any>{
      const api = 'product'
      return this.http.post(this.url + api , {productId}, this.options)
    }

    remove_cart(product:string,variant_id:string,token:string): Observable<any>{
      let api = 'user/cart/delete'
      const body = {
        product    : product,
        variant_id : variant_id
      }
      const header = new HttpHeaders({
        'Authorization': "Bearer "  + token
      })
      const requestOptions = { headers: header };
      return this.http.post(this.url + api, body,requestOptions)
      
    }  

    getList_review(page:number, product_id:string):Observable<any>{
      const api = "reviews/getList"
      const data = {
        page : page ,
        product_id : product_id
      }
      return this.http.post( this.url + api , data,this.options)
    }


    create_category(category_name:string,s_descrip:string,parentCategory:any,token:string):Observable<any>{
      let api = 'category/create'
      const Object = {
        category_name   : category_name,
        s_descrip       : s_descrip,
        parentCategory  : parentCategory
      }
      const headers = new HttpHeaders({
        "Authorization" : "Bearer " + token
      })
      const requestOptions =  {headers : headers}
      return this.http.post(this.url +  api , Object , requestOptions)
    }
    
}
