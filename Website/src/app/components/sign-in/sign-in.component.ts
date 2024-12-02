import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserServiceService } from '../../user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  constructor(
    private service:UserServiceService,
    private router:Router,
    private toastr : ToastrService
  ){

  }
 
  // get data => call service => return data back 
  user_login(email:any, password:any){
    return this.service.user_login(email.value,password.value).subscribe((data)=>{
      if(data.code == 200) {
        this.toastr.success("Login successfull") 
        localStorage.setItem('token', data.data);
        this.router.navigate(["/"])
      }
      else if(data.code == 504) this.toastr.error(data.error)
      else console.log(data.error);
    })
  }
}
