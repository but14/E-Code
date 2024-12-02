import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserServiceService } from '../../../../user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-suggest',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './home-suggest.component.html',
  styleUrl: './home-suggest.component.css'
})
export class HomeSuggestComponent {
  constructor(
    private user_service : UserServiceService
  ){}

  list_product : any[] = []
  token : string = localStorage.getItem("token") || ''

  ngOnInit(){
    this.user_service.recommender(this.token).subscribe((data:any)=>{
      console.log(data.data);
      this.list_product = data.data
    })
  }

}
