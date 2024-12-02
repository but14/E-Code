import { Component } from '@angular/core';
import { UserInfoComponent } from './components/user-info/user-info.component'; 
import { OrderHistoryComponent } from './components/order-history/order-history.component'; 
import { ReviewListComponent } from './components/review-list/review-list.component';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environments';
import { UserServiceService } from '../../user-service.service';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserInfoComponent, OrderHistoryComponent, HeaderComponent, FooterComponent,ReviewListComponent],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {

  constructor(
    private user_service : UserServiceService
  ){}

  userData:any
  token : string = localStorage.getItem("token") || ''
  baseUrl = environment.baseUrl // baseUrl from File environment 
  ngOnInit(){
    this.user_service.user_information(this.token).subscribe((data:any)=>{
      this.userData = data.data
      console.log(this.userData);
    })

  }



}
