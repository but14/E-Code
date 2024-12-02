import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../../product-service.service';
import { environment } from '../../../../../environments/environments';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  constructor(
    private product_service : ProductServiceService,
    private toastr : ToastrService
  ){}

  parentCategories:any[] = environment.parentCategories
  token:string = localStorage.getItem("token") || ''
  parentCategory :any  


  create_category(category_name:string,s_descrip:string){
    this.product_service.create_category(category_name,s_descrip,this.parentCategory,this.token).subscribe((data:any)=>{
      if (data.code == 200) {
        this.toastr.success("Tạo Danh mục Thành Công.")
      }
      else if(data.code == 504){
        this.toastr.error(data.error)
      }
      else{
        console.log(data.error);
      }
    })
  }
}
