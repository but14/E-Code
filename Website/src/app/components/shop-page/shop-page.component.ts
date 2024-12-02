import { Component,ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet ,Router} from '@angular/router';
import { ActivatedRoute,ParamMap } from '@angular/router';
import { UserServiceService } from '../../user-service.service';
import { Location } from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { __param } from 'tslib';
import { environment } from '../../../environments/environments';



@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './shop-page.component.html',
  styleUrl: './shop-page.component.css'
})
export class ShopPageComponent {
  shop_name:string = ''
  idSeller:string = ''
  page:number = 1
  sortBy:string =''
  category_id:string = ''
  listProduct :any[] = []
  listCategory :any[] = []
  dataUser :any
  url:string = ''

  baseUrl: string = environment.baseUrl

  constructor(
    private route:ActivatedRoute,
    private user_service:UserServiceService,
    private router: Router,
    private _location: Location,
  ){}

  ngOnInit(){
    // get param in url by "shop_name"
    this.route.paramMap.subscribe( (params:ParamMap)=>{
      this.shop_name = params.get("shop_name") || ''
    })
    this.route.queryParamMap.subscribe( params =>{
      this.idSeller = params.get("idSeller") || ''
      this.page = Number(params.get("page")) || 1
      this.sortBy = params.get("sortBy") || ''
      this.category_id = params.get("category_id") || ''

      this.update_product(this.page,this.sortBy,this.category_id)
    })

    this.user_service.getlistCategory(this.idSeller).subscribe( (data:any)=>{
      if(data.code == 200 ){
        this.listCategory = data.data
      } 
      else console.log(data.error);
      
    }) 

    
    // get data is hidden in url by "idSeller"
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear(); return `${day}-${month}-${year}`;
    return `${day}-${month}-${year}`;
  }
  // Xử lý chuyển tab trong trang Shop
  handleClickTabShopPage(id: string) {
    // event.this.preventDefault();
    if(id === "btnHomeID"){
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      (document.getElementById(id) as HTMLElement).classList.add("checked");
      (document.getElementById('btnAllProductID') as HTMLElement).classList.remove("checked");
    }else{
      (document.getElementById('topOfproductListMainID') as HTMLElement).scrollIntoView();
      (document.getElementById(id) as HTMLElement).classList.add("checked");
      (document.getElementById('btnHomeID') as HTMLElement).classList.remove("checked");
    }
  }

  productByCondition(page:number,sortBy:string,categoryId:string,event: any){
    this.sortBy = sortBy;
    // this._location.go(`/shop-page/${this.shop_name}?idSeller=${this.idSeller}&category_id=${categoryId}&page=${page}&sortBy=${sortBy}`);
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page, sortBy: this.sortBy, category_id: categoryId, idSeller: this.idSeller }, queryParamsHandling: 'merge',})
    // let listCategoryOfProduct = (document.getElementsByClassName('categoryOfProduct') as any);
    // for(let i of listCategoryOfProduct){
    //   i.classList.remove('active');
    // }
    // (document.getElementById(categoryId) as HTMLElement).classList.add('active');
    this.update_product(page,sortBy,categoryId);
    this.handleClickTabShopPage('btnAllProductID');
  }

  updatePage(page:number, event: any){
    let pagination = document.getElementById('paginationInShopPageID');
    pagination?.childNodes.forEach(child => {
      (child as any).classList.remove('active');
    })
    // console.log(event.target)
    event.target.classList.add('active');
    // this._location.go(`/shop-page/${this.shop_name}?idSeller=${this.idSeller}&category_id=${this.category_id}&page=${page}&sortBy=${this.sortBy}`);
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: page }, queryParamsHandling: 'merge' });
    this.update_product(page,this.sortBy,this.category_id)
  }

  update_product(page:number,sortBy:string,categoryId:string){
    return this.user_service.shop_detail(this.idSeller,page,sortBy,categoryId).subscribe( (data:any)=>{
      if(data.code == 200){        
        this.dataUser = data.data.dataUser
        this.listProduct = data.data.listProduct
        // console.log(this.dataUser);
      }
      else{
        console.log(data.error);
      }
    })
  }

  
  moveToProduct(product_id:string,product_slug:string){
    this.router.navigate([`/product-detail/${product_slug}`] , { queryParams : { idProduct : product_id}})
  }

  // Thêm phương thức để cuộn đến một phần tử cụ thể
  // scrollToElement(elementId: string) { const element = document.getElementById(elementId); if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
}
