import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { UserServiceService } from '../../../../user-service.service';
import { ActivatedRoute,ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [RouterLink, RouterOutlet,CommonModule],
  providers :[DatePipe],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent {

  constructor(
    private user_service:UserServiceService,
    private router:Router,
    private route:ActivatedRoute,
    private datePipe :DatePipe,
    private toastr : ToastrService
  ){}

  token:string = localStorage.getItem("token") || ''
  page:number = 1
  currentPage: number = 1; // Khởi tạo trang hiện tại là trang đầu tiên
  sortBy:string= ''
  order_status:string= ''
  listOrder : any[] = []

  baseUrl: string = environment.baseUrl
  


  ngOnInit(){  
    this.update_data(this.page , this.sortBy,this.order_status,)
  }

  update_data(page:number,sortBy:string,order_status:string){
    this.user_service.getListOrder_for_Admin(this.token,page,sortBy,order_status).subscribe((data:any)=>{
      if (data.code == 200) {
        this.listOrder = data.data
        console.log(data.data);
      } else {
        console.log(data.error);
      }
    })
  }

  goToPage(page:number){
    this.currentPage = page; // Cập nhật trang hiện tại
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page , sortBy : this.sortBy , status : this.order_status }, queryParamsHandling: 'merge' });
    this.update_data(page , this.sortBy , this.order_status)
  }

  filter_status(status:string, event:any){
    this.page = 1
    this.order_status = status
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page , sortBy : this.sortBy , status : this.order_status }, queryParamsHandling: 'merge' });
    this.update_data(this.page, this.sortBy, status)
    //
    let btnFilterOrder = (document.getElementsByClassName('btnFilterOrder') as any);
    // console.log(event.target.classList.add("checked"));
    for(let i=0; i<btnFilterOrder.length; i++){
      btnFilterOrder[i].classList.remove('checked');
    }
    event.target.classList.add("checked");
  }

  change_sortBy(sortBy:string){
    this.sortBy = sortBy
    this.page = 1
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page , sortBy : this.sortBy , status : this.order_status }, queryParamsHandling: 'merge' });
    this.update_data(this.page, sortBy, this.order_status)
  }

  update_status_order(order_id:string , status_update:string ){
    console.log(order_id);
    console.log(status_update);
    this.user_service.update_statusOrder_for_Admin(this.token , order_id ,status_update).subscribe((data:any)=>{
      if (data.code == 200) {
        this.toastr.success("Thông tin đơn hàng sau khi thay đổi")
        this.router.navigate(["/admin-shop/order-management/detail-order"] , { queryParams : { orders_ID : order_id }  }  )
        this.update_data(this.page,this.sortBy,this.order_status)
        console.log(data.data);
      } else {
        console.log(data.error);
      }
    })
  }

  format_date(date_string:string){
    return this.datePipe.transform(date_string,'medium')
  }
  
  isActive(page: number): boolean { return this.currentPage === page; }


}
