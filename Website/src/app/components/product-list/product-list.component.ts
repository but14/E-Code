import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ProductServiceService } from '../../product-service.service';
import { UserServiceService } from '../../user-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, RouterOutlet,CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  constructor(
    private product_service :ProductServiceService,
    private user_service : UserServiceService,
    private route : ActivatedRoute,
    private router : Router
  ){}

  sortBy:string = ''
  page:number = 1
  rating:number = 0
  detail:any = {
    name :  '',
    value : ''
  }
  list_product : any[] = []
  search_query_category : any
  search_query : any

  baseUrl:string= environment.baseUrl

  ngOnInit(){
    this.search_query = this.route.snapshot.queryParamMap.get("search_query") || ''
    this.search_query_category = this.route.snapshot.queryParamMap.get("search_query_category") || ''
    if (this.search_query) {
      this.search_query = this.search_query.toString()
      this.searching(this.search_query,this.sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.search_query_category = this.search_query_category.toString()
      this.getListProduct_byCategory(this.search_query_category,this.sortBy,this.page,this.rating , this.detail)
    }

  }

  searching(search_query:string,sortBy:string,page:number,rating:number , detail:any){
    this.user_service.searching(search_query,sortBy,page, rating , detail).subscribe((data)=>{
      if(data.code == 200){
        this.list_product = data.data
      }
      else{
        console.log(data.error);
      }
    })
  }

  getListProduct_byCategory(search_query_category:string, sortBy :string , page:number, rating:number, detail:any){
    return this.user_service.getListProduct_byCategory(search_query_category,sortBy,page,rating,detail).subscribe((data)=>{
      if(data.code == 200){
        this.list_product = data.data
      }
      else{
        console.log(data.error);
      }
    })
  }
  

  productByCondition(sortBy:string){
    this.sortBy = sortBy
    this.page = 1
    if (this.search_query) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: sortBy, page : this.page }, queryParamsHandling: 'merge' });
      this.searching(this.search_query,sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: sortBy , page : this.page , rating : this.rating}, queryParamsHandling: 'merge' });
      this.getListProduct_byCategory(this.search_query_category,sortBy,this.page, this.rating, this.detail)
    }
  }

  updateLocation(value : string){
    this.page = 1
    this.detail = {
      name  : "location",
      value : value
    }
    if (this.search_query) {
      this.searching(this.search_query,this.sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.sortBy , page : this.page , rating : this.rating, location : true }, queryParamsHandling: 'merge' });
      this.getListProduct_byCategory(this.search_query_category,this.sortBy,this.page, this.rating , this.detail)
    }
  }

  updateBrand(brand: string){
    this.page = 1
    this.detail = {
      name  : "brand",
      value : brand
    }
    if (this.search_query) {
      this.searching(this.search_query,this.sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.sortBy , page : this.page , rating : this.rating, location : true }, queryParamsHandling: 'merge' });
      this.getListProduct_byCategory(this.search_query_category,this.sortBy,this.page, this.rating , this.detail)
    }
  }

  // cứ mỗi query thì ta gom lại từ từ , chỉ có page thì luôn gán lại = 1
  ratingFilter(rating:number){
    this.page = 1
    this.rating = rating
    if (this.search_query) {
      this.searching(this.search_query,this.sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.sortBy , page : this.page , rating : rating }, queryParamsHandling: 'merge' });
      this.getListProduct_byCategory(this.search_query_category,this.sortBy,this.page, rating , this.detail)
    }
  }

  updatePage(event:any , page:number){
    let pagination = document.getElementById('paginationInShopPageID');
    pagination?.childNodes.forEach(child => {
      (child as any).classList.remove('active');
    })
    event.target.classList.add('active');
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: page }, queryParamsHandling: 'merge' });
    this.getListProduct_byCategory(this.search_query_category, this.sortBy, page , this.rating, this.detail)
  }

  reset(){
    this.sortBy = ''
    this.page = 1
    this.rating = 0
    this.detail = {
      name :  '',
      value : ''
    }
    if(this.search_query) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.sortBy, page : this.page }, queryParamsHandling: 'merge' });
      this.searching(this.search_query,this.sortBy,this.page, this.rating , this.detail)
    }
    else{
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.sortBy , page : this.page , rating : this.rating}, queryParamsHandling: 'merge' });
      this.getListProduct_byCategory(this.search_query_category,this.sortBy,this.page, this.rating, this.detail)
    }
  }

  // Mở Bộ lọc sản phẩm 
  openFilterProductList(): void{
    (document.getElementById('leftOfProductListID') as HTMLDivElement).style.transform = 'translateX(0px)';
  }
  // Đóng Bộ lọc sản phẩm 
  closeFilterProductList(): void{
    (document.getElementById('leftOfProductListID') as HTMLDivElement).style.transform = 'translateX(-500px)';
  }


}
