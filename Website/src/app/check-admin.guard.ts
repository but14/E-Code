import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core'
import { AppServiceService } from './app-service.service';
import { map } from 'rxjs';


export const checkAdminGuard: CanActivateFn = (route, state) => {
  //inject() là một hàm mới trong Angular, giúp bạn truy xuất các dịch vụ (services) trực tiếp mà không cần phải thông qua constructor
  // Guard trong angular muốn trả về 1 Observable chứ không phải là 1 subscribetion
  const router = inject(Router)
  const service = inject(AppServiceService)

  const token = localStorage.getItem('token')
  if(!token){
    alert("Vui long Login") 
    router.navigate(["/sign-in"]) // login
    return false
  }
  else{
    return service.checkToken(token).pipe(
      map( data =>{
        if (data.code == 200 && data.data.data.user_role == "seller") {
          return true
        }
        alert('Vui lòng đăng nhập lại')
        localStorage.removeItem('token')
        router.navigate(['/login'])
        return false
      })
    )
  }

};
