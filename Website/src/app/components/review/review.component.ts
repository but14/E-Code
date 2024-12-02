import { Component } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { UserServiceService } from '../../user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  constructor(
    private route : ActivatedRoute,
    private user_service : UserServiceService,
    private router: Router,
    private toastr : ToastrService
  ){}

  product_id     : string  = '' 
  variant_id     : string  = ''  
  order_id       : string  = '' 
  numberOfStars  : number = 0
  review_context : string = ''
  file_array :any
  token :string = localStorage.getItem("token") || ''
  

  ngOnInit(){
    this.route.queryParamMap.subscribe( params=>{
      this.product_id   = params.get("product_id") || ''
      this.variant_id   = params.get("variant_id") || '' 
      this.order_id     = params.get("order_id") || ''
    })
  }


// xem trước hình đánh giá
handlePreViewRatingImages(event:any): void{
  (document.getElementById('listImagesChoosedID') as HTMLDivElement).innerHTML = "";
  // let imgsPreLink = [];
  let filesImg = (document.getElementById('imagesRatingID') as any).files;
  for(let i=0; i< filesImg.length; i++){
    const imgElement = document.createElement("img");
    const div = document.createElement("div");
    const button = document.createElement("button");
    // 
    div.id = `imgWrapperID${i}`;
    //
    button.addEventListener('click', function(){
      // (document.getElementById('imgWrapper0') as HTMLDivElement);
    }); 
    //
    imgElement.src = URL.createObjectURL(filesImg[i]);
    imgElement.style.height = '80px';
    imgElement.style.width = '80px';
    // imgElement.style.objectFit = 'cover';
    imgElement.style.border =  '.5px solid #efefef';
    imgElement.style.borderRadius = '4px';
    imgElement.style.margin = '5px';
    imgElement.id = `${i}`;
    ((document.getElementById('listImagesChoosedID') as HTMLDivElement).appendChild(imgElement));
  }
  // if(event.target.files.length > 0){
    this.file_array =  Array.from(event.target.files)
    console.log(this.file_array);
  // }  
}

// đánh giá sao (1-5 sao) cho sản phẩm
starRatingForProduct(numberOfStars: string): void {
  let currentStarOfProduct = document.getElementById('starRatingOfProductID') as HTMLInputElement;
  let starRatingForm = document.getElementsByClassName('starRatingOfProduct')[0] as HTMLDivElement;
  if(numberOfStars != currentStarOfProduct.value){
    for(let i=1; i<=5; i++){
      if(i <= ((numberOfStars as any) - 0)){
        ((starRatingForm.childNodes[i]) as HTMLElement).className = "fa fa-star checked"
      }else{
        ((starRatingForm.childNodes[i]) as HTMLElement).className = "fa fa-star"
      }
    }
    (document.getElementById('starRatingOfProductID') as HTMLInputElement).value = numberOfStars
    console.log((document.getElementById('starRatingOfProductID') as HTMLInputElement).value)
  }else{
    for(let i=1; i<=5; i++){
      ((starRatingForm.childNodes[i]) as HTMLElement).className = "fa fa-star"
    }
    (document.getElementById('starRatingOfProductID') as HTMLInputElement).value = '0';
    console.log("Chưa đánh giá")
  }
  this.numberOfStars = parseInt(numberOfStars)
  // console.log(this.numberOfStars);  
}

getReviewContext(){
  return (document.getElementById('reviewContextID') as HTMLTextAreaElement).value;
}

create_review(){
  const formData = new FormData()
  formData.append("product_id",this.product_id)
  formData.append("product_variants_id",this.variant_id)
  formData.append("order_id",this.order_id)
  formData.append("review_rating",this.numberOfStars.toString())
  formData.append("review_context", this.getReviewContext()) 
  if(this.file_array.length > 0){
    this.file_array.forEach( (file:any)=>{
      formData.append("review_image", file)
    })
  }
  
  this.user_service.create_review(formData,this.token).subscribe((data:any)=>{
    if(data.code == 200){
      this.toastr.success("Đánh giá hoàn tất")
      this.router.navigate(["/profile-user/order-history"])
    } else{
      console.log(data.error);
      
    }
  })

}


}
