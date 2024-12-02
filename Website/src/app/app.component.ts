import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { HomeNewsComponent } from "./components/home/components/home-news/home-news.component";
import { CategoryComponent } from "./components/home/components/category/category.component";
import { HomeFlashSaleComponent } from "./components/home/components/home-flash-sale/home-flash-sale.component";
import { AdvertiseComponent } from "./components/home/components/advertise/advertise.component";
import { HomeSuggestComponent } from "./components/home/components/home-suggest/home-suggest.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CustomDatePipe } from '../CustomDatePipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeNewsComponent, CategoryComponent, HomeFlashSaleComponent, AdvertiseComponent, HomeSuggestComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-project';
  
  constructor() {
    
  }


}
