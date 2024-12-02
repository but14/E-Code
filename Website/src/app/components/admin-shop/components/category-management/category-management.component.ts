import { Component } from '@angular/core';
import { ActivatedRoute,ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductServiceService } from '../../../../product-service.service';
import { UserServiceService } from '../../../../user-service.service';
import { RouterOutlet,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent {
  constructor(
    private toastr : ToastrService,
    private user_service : UserServiceService,
    private route : ActivatedRoute,
    private router: Router
  ){}

// common Module, ngFor ngIf- service to connect api,ngOnInit intera value, activated,parramamap tp get params
  token:string = localStorage.getItem("token") || ''
  listCategory: any[] = []
  page:number = 1
  currentPage: number = 1; // Khởi tạo trang hiện tại là trang đầu tiên


  ngOnInit(){
    this.update_category(this.page)   
  }

  update_category(page:number){
    return this.user_service.getlistCategoryByToken(this.token,page).subscribe( (data:any)=>{
      this.listCategory = data.data.listCategory
    })  
  }

  delete_category(categoriesID:string){
    return this.user_service.delete_category(categoriesID,this.token).subscribe( (data:any)=>{
      if(data.code == 200){
        this.toastr.success(data.data)
        this.update_category(this.page)
      }
      else console.log(data.error);
    })
  }

  goToPage(page:number){
    this.currentPage = page; // Cập nhật trang hiện tại
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: page }, queryParamsHandling: 'merge' });
    this.update_category(page)
  }
  isActive(page: number): boolean { return this.currentPage === page; }

  
  navigate(){
    this.router.navigate(["/admin-shop/add-category"])
  }


}
