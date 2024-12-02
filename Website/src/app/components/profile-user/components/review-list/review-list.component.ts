import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../user-service.service';
import { ProductServiceService } from '../../../../product-service.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  providers : [DatePipe],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent {
  constructor(
    private user_service    : UserServiceService,
    private product_service : ProductServiceService,
    private router : Router,
    private datePipe : DatePipe
  ){}

  token:string = localStorage.getItem("token") || ''
  page :number = 1
  detail_order : any[] = [] 
  list_order : any[] = []
  product_details:any[] =[]
  productDetails : { [ ProductID:string ] :any } = {}

  order_status : string = "Successfull"
  // order_status : string = "Processing"


  baseUrl: string = environment.baseUrl


  ngOnInit(){
    this.user_service.getList_order(this.token,this.page, this.order_status).subscribe((data:any)=>{
      if(data.code == 200 ){
        this.list_order = data.data
        console.log(this.list_order);
        for(let order of this.list_order){
          for(let detail of order.order_details){
            if (detail.variant_id  && detail.product_id) {
              this.get_detail_product(detail.product_id, detail.variant_id)
            }
          }
        }
      }else{
        console.log(data.error);
      }
    })
  }

  format_date(date:string){
    return this.datePipe.transform(date ,'medium')
  }

  get_detail_product(product_id:string , variant_id:string){
    if (!this.productDetails[product_id]) {
      this.user_service.getList_order_filter(product_id,variant_id).subscribe((data:any)=>{
       if (data.code == 200) {
        // console.log(data);
        this.productDetails[product_id] = data.data
        // console.log(this.productDetails[product_id].product_name);
       } else {
        console.log(data.error);
        
       }
      })
    }
    
  }

}
