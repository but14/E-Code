import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserServiceService } from '../../user-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-checkout1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout1.component.html',
  styleUrl: './checkout1.component.css'
})
export class Checkout1Component {

  constructor(
    private http: HttpClient,
    private user_service: UserServiceService,
    private router: Router,
    private toastr : ToastrService

  ) { }

  token :string = localStorage.getItem("token") || ''
  product_cart:any[] = []
  order_shipping_cost : number  = 20000
  baseUrl: string = environment.baseUrl
  product_amount:number = 0 
  isAvailable = false
  check:boolean = true
  infor_shipping :any = {
    name:"Ngo Van Duc Thinh",
    phone:"0969935712",
    address : "20/4, Hẻm 20 Đường Chu Văn An, Khu Phố 5, Phường Xuân Bình, Thành Phố Long Khánh, Đồng Nai"
  }
  order_details:any[] = []


  ngOnInit(){
    this.update_cart()
  }

  change_status(){
    this.check = !this.check
  }

  update_location(name:any,phone:string,address:string){
    this.infor_shipping = { 
      name:name,
      phone:phone,
      address:address
    } 
    this.change_status()
  }

  createPayment() {
    const paymentData = {
      amount: this.order_shipping_cost + this.product_amount,  // Ví dụ số tiền
      bankCode: 'NCB',  // Ví dụ mã ngân hàng
      language: 'vn'
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('http://localhost:8888/order/create_payment_url', paymentData,{headers})
      .subscribe( (response:any) => {
        // Chuyển hướng người dùng tới URL thanh toán nhận được từ server
        window.location.href = response.redirectUrl;
      }, (error:any) => {
        console.error('Lỗi khi tạo URL thanh toán:', error);
      });
  }

  update_cart(){
    return this.user_service.user_cart(this.token).subscribe((data:any)=>{
      if(data.code){
        this.product_cart =  data.data[0].cart
        // console.log(data.data);
        this.product_cart.forEach(element =>{
          this.product_amount  += element.product.product_variants[0].price * element.quantity
          let object_detail = {
            product_id  : element.product._id,
            variant_id  : element.product.product_variants[0]._id,
            quantity    : element.quantity,
            unit_price  : element.product.product_variants[0].price
          }
          this.order_details.push(object_detail)
        })
      }
      else{
        console.log(data.error);
      }
    })
  }
  
  create_order(){
    if(this.product_cart.length > 0){
      var data = {
        "staff_id": this.product_cart[0].product.userID._id,
        "order_total_cost": this.product_amount,
        "order_buyer": this.infor_shipping.name,
        "order_address": this.infor_shipping.name + "  " +  this.infor_shipping.phone + "  " + this.infor_shipping.address, // must a Object has 3 property
        "order_details": this.order_details,
        "order_shipping_cost": this.order_shipping_cost,
        "order_payment_cost": this.product_amount + this.order_shipping_cost,
        // "order_status": "Processing" 
        "order_status": "Ordered"
      }
      return this.user_service.create_order(data,this.token).subscribe((data:any)=>{
        if(data.code == 200){
          this.user_service.delete_order_cart(this.token).subscribe((data:any)=>{
            this.isAvailable = true;
            this.toastr.success("Đã mua hàng thành công");
            (document.getElementById('xxx') as HTMLButtonElement).disabled = true;
            (document.getElementById('xxx') as HTMLButtonElement).style.background = 'pink';
            (document.getElementById('xxxx') as HTMLButtonElement).disabled = true;
            (document.getElementById('xxxx') as HTMLButtonElement).style.background = 'pink';
          })
        } 
        else console.log(data.error); 
      })
    }
    else{
      return 
    }
  }
  
  return(){
    this.router.navigate([""])
  }
 

}
