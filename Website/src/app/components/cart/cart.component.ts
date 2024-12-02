import { Component,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../user-service.service';
import { ProductServiceService } from '../../product-service.service';
import { AppServiceService } from '../../app-service.service';
import { environment } from '../../../environments/environments';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, RouterOutlet,CommonModule,],
  providers : [ ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor(
    private user_service:UserServiceService,
    private product_service:ProductServiceService,
    private toastr : ToastrService
  ){}

  private app_service = inject(AppServiceService)

  token:any
  product_cart : any[] = [] 
  total_in_cart:number = 0
  baseUrl: string = environment.baseUrl

  ngOnInit(){
    this.token = localStorage.getItem("token")
    this.update_cart()
  }

  remove_cart(product:string,variant_id:string){
    return this.product_service.remove_cart(product,variant_id,this.token).subscribe( (data:any)=>{
      if(data.code == 200){
        this.toastr.success("Xóa thành công");
        this.update_cart()
      } 
      else console.log(data.error);
    })
  }

  change_quality(quantity:any,product:any,variant_id:any){
    return this.user_service.update_cart(quantity.value,product,variant_id,this.token).subscribe((data:any)=>{
      if(data.code == 200) {
        this.toastr.success("Update thành công");
        // alert("Update thành công")
        this.update_cart()
      } 
      console.log(data.error); 
    })
  }

  update_cart(){
    this.user_service.user_cart(this.token).subscribe( data=>{
      if(data.code == 200){
        this.product_cart =  data.data[0].cart
        console.log(this.product_cart);
        this.app_service.sendData({key : "cart_length",value : data.data[0].cart.length})
        this.total_in_cart = 0 // update = 0 , để reset tổng về 0, sau mỗi lần update để tính tổng lại và cập nhật giá trị cho biến này!
        this.product_cart.forEach( (element:any) => {
          this.total_in_cart += element.product.product_variants[0].price * element.quantity
        });
      }
      else console.log(data.error);  
    })
  }

}
