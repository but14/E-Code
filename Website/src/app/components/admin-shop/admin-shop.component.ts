import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-shop',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-shop.component.html',
  styleUrl: './admin-shop.component.css'
})
export class AdminShopComponent {

  logout(){
    localStorage.removeItem("token")
    window.location.reload()
  }

}
