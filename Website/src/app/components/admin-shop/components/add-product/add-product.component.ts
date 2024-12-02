import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ProductServiceService } from '../../../../product-service.service';
import { UserServiceService } from '../../../../user-service.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ FormsModule,CommonModule ],// Thêm FormsModule vào đây
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  constructor(
    private service_product:ProductServiceService,
    private user_service:UserServiceService,
    private toastr : ToastrService
  ){}


  selectedFile: File[] = []
  img_product :File | null = null

  
  details : { name :String , value:String}  = {
    name : '',
    value : ''
  }
  product_details :any = []

  
  variants : { variant_name :String , price:Number, in_stock:Number }  = {
    variant_name : '',
    price        : 0,
    in_stock     : 0
  }
  product_variants :any = []
  product_variants_img:any = []

  allCategory: any[] = []
  categoriesID:string = ''

  token:string = ''
  token1:string = localStorage.getItem("token") || ''
 
  ngOnInit(){
    this.user_service.getAllCategory(this.token1).subscribe( (data:any)=>{
      if (data.code == 200) {
        console.log(data.data);
        this.allCategory = data.data
      }else{
        console.log(data.error);
        
      }
    })
  }


  isFileSelected(event:any){
    if(event.target.files.length > 0){
      this.selectedFile = Array.from(event.target.files) 
      console.log(this.selectedFile);
    }
  }
    
 // alert("ok") không thể đặt alert() hay log ra được ngoài component , chỉ có thể gọi bên trong 1 hàm nào đó mới được

  handleDeleteDetail(index: any): void{
    delete this.product_details[index]
  }
  // Handle Thêm chi tiết
  handleAddDetail(): void{
    let nameDetail: any;
    let valueDetail: any;
    //
    nameDetail = (document.getElementById('nameDetailID') as HTMLInputElement).value;
    valueDetail = (document.getElementById('valueDetailID') as HTMLInputElement).value;
    // Tạo div chính
    const div = document.createElement("div");
    div.id = `${this.product_details.length}`
    // {nameDetail}ID
    div.className = "detailPreviewBox";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.style.width = "100%";
    // Tạo span để chứa tên chi tiết
    const spanNameDetail = document.createElement("span");
    spanNameDetail.style.display = "block";
    spanNameDetail.style.color = "#333";
    spanNameDetail.style.fontWeight = "400";
    spanNameDetail.style.padding = "10px";
    spanNameDetail.textContent = nameDetail;
    // Tạo span để chứa giá trị chi tiết
    const spanValueDetail = document.createElement("span");
    spanValueDetail.style.display = "block";
    spanValueDetail.style.color = "black";
    spanValueDetail.style.fontWeight = "500";
    spanValueDetail.style.padding = "10px";
    spanValueDetail.style.textAlign = "left";
    spanValueDetail.textContent = valueDetail;
    // Tạo button Xóa
    const buttonDeleteDetail = document.createElement("button");
    buttonDeleteDetail.className = "btnDeleteDetail";
    buttonDeleteDetail.style.border = ".5px solid #c0392b";
    buttonDeleteDetail.style.padding = "10px 5px";
    buttonDeleteDetail.style.fontSize = "12px";
    buttonDeleteDetail.style.fontWeight = "600";
    buttonDeleteDetail.style.color = "#c0392b";
    buttonDeleteDetail.style.borderRadius = "4px";
    buttonDeleteDetail.style.boxShadow = "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px";
    buttonDeleteDetail.style.cursor = "pointer";
    buttonDeleteDetail.style.transition = "all .1s";
    buttonDeleteDetail.textContent = "Xóa";
    buttonDeleteDetail.type = "button";
    buttonDeleteDetail.addEventListener('click', () => {
      this.handleDeleteDetail(div.id);
      (document.getElementById(`${div.id}`) as HTMLElement).style.display = "none";
    });
    // button.onclick = handleDeleteVariant();
    // Ghép các phần tử vào div chính
    div.appendChild(spanNameDetail);
    div.appendChild(spanValueDetail);
    div.appendChild(buttonDeleteDetail);
    if(nameDetail && valueDetail){
      (document.getElementById('detailPreviewBoxID') as HTMLElement).appendChild(div);
      (document.getElementById('nameDetailID') as HTMLInputElement).value = "";
      (document.getElementById('valueDetailID') as HTMLInputElement).value = "";
      this.details = {
        name : nameDetail,
        value : valueDetail
      }
      this.product_details.push(this.details)
    }
  }
  // Handle xem trước ảnh sản phẩm
  handlePreviewProductImages(): void{
  //   // tạo URL ảo cho từng ảnh được chọn
  //   let previewImageFile = [];
  //   let previewImageURL = [];
  //   // lấy ảnh từ input
  //   for(let i=0; i<5; i++){
  //     previewImageFile.push((document.getElementById('productImagesID') as any).files[i])
  //   }
  //   if(previewImageFile.length > 0){
  //     // tạo URL ảo
  //     for(let file of previewImageFile){
  //       previewImageURL.push(URL.createObjectURL(file))
  //     }
  //     // show
  //     (document.getElementById('imagePreviewID1') as HTMLImageElement).src = previewImageURL[0];
  //     (document.getElementById('imagePreviewID2') as HTMLImageElement).src = previewImageURL[1];
  //     (document.getElementById('imagePreviewID3') as HTMLImageElement).src = previewImageURL[2];
  //     (document.getElementById('imagePreviewID4') as HTMLImageElement).src = previewImageURL[3];
  //     (document.getElementById('imagePreviewID5') as HTMLImageElement).src = previewImageURL[4];
  //   }
  }
  // Handle thêm / xem trước biến thể
  handlePreviewVariant(this: any): void{
    // this.preventDefault();
    let previewVariantName: any;
    let previewVariantPrice: any;
    let previewVariantQuantity: any;
    let previewVariantImage: any;
    let previewVariantImageURL: any;
    // lấy giá trị từ input, tạo URL ảo
    previewVariantName = (document.getElementById('nameVariantID') as HTMLInputElement).value;
    previewVariantPrice = (document.getElementById('priceVariantID') as HTMLInputElement).value;
    previewVariantQuantity = (document.getElementById('quantityVariantID') as HTMLInputElement).value;
    previewVariantImage = (document.getElementById('imageVariantID') as any).files[0];
    previewVariantImageURL = URL.createObjectURL(previewVariantImage);
    // show
    // Tạo div chính
    const div = document.createElement("div");
    div.id = `${previewVariantName}ID`
    div.className = "variant";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.style.padding = "10px";

    // Tạo span để chứa tên biến thể
    const span = document.createElement("span");
    span.style.width = "20%";
    span.style.display = "block";
    span.style.color = "#222";
    span.style.fontWeight = "400";
    span.style.fontSize = "14px";
    span.style.textAlign = "center";
    span.textContent = previewVariantName;

    // Tạo img
    const img = document.createElement("img");
    img.src = previewVariantImageURL;
    img.alt = "";
    img.style.width = "20%";
    // img.style.height = "150px";
    img.style.textAlign = "center";
    img.style.borderRadius = "8px";

    // Tạo span để chứa giá
    const spanPrice = document.createElement("span");
    spanPrice.style.width = "20%";
    spanPrice.style.display = "block";
    spanPrice.style.color = "#222";
    spanPrice.style.fontWeight = "400";
    spanPrice.style.fontSize = "14px";
    spanPrice.style.textAlign = "center";
    spanPrice.textContent = previewVariantPrice;

    // Tạo span để chứa số lượng
    const spanQuantity = document.createElement("span");
    spanQuantity.style.width = "20%";
    spanQuantity.style.display = "block";
    spanQuantity.style.color = "#222";
    spanQuantity.style.fontWeight = "400";
    spanQuantity.style.fontSize = "14px";
    spanQuantity.style.textAlign = "center";
    spanQuantity.textContent = previewVariantQuantity;

    // Tạo button Xóa
    const button = document.createElement("button");
    button.className = "btnDeleteVariant";
    button.style.width = "20%";
    button.style.border = ".5px solid #c0392b";
    button.style.padding = "10px 5px";
    button.style.fontSize = "12px";
    button.style.fontWeight = "600";
    button.style.color = "#c0392b";
    button.style.borderRadius = "4px";
    button.style.boxShadow = "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px";
    button.style.cursor = "pointer";
    button.style.transition = "all .1s";
    button.textContent = "Xóa";
    button.type = "button";
    button.addEventListener('click', function(){
      (document.getElementById(`${previewVariantName}ID`) as HTMLElement).style.display = 'none';
    })
    // button.onclick = handleDeleteVariant();

    // Ghép các phần tử vào div chính
    div.appendChild(span);
    div.appendChild(img);
    div.appendChild(spanPrice);
    div.appendChild(spanQuantity);
    div.appendChild(button);
    if(previewVariantName && previewVariantPrice && previewVariantQuantity){
      (document.getElementById('previewVariantBoxID') as HTMLElement).appendChild(div);
      this.variants = {
        variant_name : previewVariantName,
        price        : previewVariantPrice,
        in_stock     : previewVariantQuantity
      }
      // console.log(previewVariantName);
      // console.log(this.variants);
      this.product_variants.push(this.variants)
      //console.log(this.product_variants);
      this.product_variants_img.push(previewVariantImage)
      console.log(this.product_variants_img);
      (document.getElementById('nameVariantID') as HTMLInputElement).value = "";
      (document.getElementById('priceVariantID') as HTMLInputElement).value = "";
      (document.getElementById('quantityVariantID') as HTMLInputElement).value = "";
    }
  }

  onCategoryChange(event:any){
    const selectedCategoryId = event.target.value; // Lấy giá trị của danh mục đã chọn
    this.categoriesID = selectedCategoryId
  }

  async create_product(product_name:any,product_short_description:any, product_description:any,product_supp_price:any){
    let formData = new FormData()
    formData.append('product_name', product_name.value);
    formData.append('product_short_description', product_short_description.value);
    formData.append('product_description', product_description.value);
    formData.append('categoriesID', this.categoriesID);
    formData.append('product_supp_price', product_supp_price.value);
    if(this.product_details.length > 0) {
      // console.log(this.product_details);
      formData.append("product_details_arr", JSON.stringify(this.product_details))
    }
    if (this.selectedFile.length > 0 ) {
      for(let file of this.selectedFile){
        formData.append('img_product', file)
      }
    }
    if(this.product_variants.length > 0) {
      formData.append("product_variants", JSON.stringify(this.product_variants))
    }
    if(this.product_variants_img.length > 0){
      for(let variant_img of this.product_variants_img){
        await formData.append("product_variants_img",variant_img)
      }
    }
    console.log(this.product_variants_img);
    this.token = localStorage.getItem("token") || ''
    this.service_product.create_product(formData,this.token).subscribe( data => {
      if(data.code == 200 ){
        window.location.reload()
        this.toastr.success("OKE")
      } 
      if(data.code == 504 ) this.toastr.error("Xem lai cac truong")
      if(data.error ) console.log(data.error);
    })
  }
}
