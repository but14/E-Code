import { Component,inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppServiceService } from '../../app-service.service';
import { UserServiceService } from '../../user-service.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private app_service : AppServiceService,
    private user_service :UserServiceService ,
    private router : Router
  ){}

  length_cart:any
  login_boolean : boolean = false 
  userData : any
  checkAdmin : boolean = false
  token:string = localStorage.getItem("token") || ''
  baseUrl = environment.baseUrl

  ngOnInit(){
    this.app_service.getData().subscribe((data:any)=>{
      if(data.key == "cart_length"){
        if(data.value == 0){
          this.length_cart = 0
        }
        this.length_cart = data.value
      }
    })
    if (this.token) {
      this.login_boolean = true
      this.user_service.user_information(this.token).subscribe((data:any)=>{
        if(data.code == 200){
          if (data.data.user_role == "seller") {
            this.checkAdmin = true
          }
          this.userData = data.data
        }
      })
    }

  }


  searching(search_query:string){
    this.router.navigate(["/product-list"], {queryParams : { search_query : search_query , page : 1 , sortBy : ''} } )
  }

  logout(){
   localStorage.removeItem("token")
   window.location.reload()
  }

  reset(searchQuery: HTMLInputElement){
    searchQuery.value = '';
  }

  // open form search
  openFormSearchOnMobile(): void{
    
  }
}
