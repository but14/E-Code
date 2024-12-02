import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../user-service.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  constructor(
    private user_service : UserServiceService
  ){}

  userData:any
  token : string = localStorage.getItem("token") || ''
  baseUrl = environment.baseUrl // baseUrl from File environment 
  ngOnInit(){
    this.user_service.user_information(this.token).subscribe((data:any)=>{
      this.userData = data.data
      // console.log(this.userData);
    })

  }


  // Thay đổi ảnh đại diện khi chọn ảnh mới (xem trước)
  handleProfileCoverImageUpdate(): void{
    // xóa Object URL trước đó
    const oldImagePreview = (document.getElementById('avatarInfoID') as HTMLImageElement).src;
    URL.revokeObjectURL(oldImagePreview);
    // tạo URL ảo để hiện khi chọn hình khác từ máy
    // const fileCoverImage = avatarInfoID.target.files[0];
    const fileCoverImage = (document.getElementById('btnChooseImageID') as any).files[0];
    if (fileCoverImage) {
        let fileCoverImagePreview = URL.createObjectURL(fileCoverImage);
        // Url ảo cho ảnh bìa
        // setProfileCoverImagePreview(fileCoverImagePreview);
        (document.getElementById('avatarInfoID') as HTMLImageElement).src = fileCoverImagePreview;
    }
    //
    console.log(URL.createObjectURL(fileCoverImage));
  };
}
