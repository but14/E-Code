import { Component } from '@angular/core';
import { HomeNewsComponent } from './components/home-news/home-news.component';
import { CategoryComponent } from './components/category/category.component';
import { HomeFlashSaleComponent } from './components/home-flash-sale/home-flash-sale.component';
import { AdvertiseComponent } from './components/advertise/advertise.component';
import { HomeSuggestComponent } from './components/home-suggest/home-suggest.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HomeNewsComponent, CategoryComponent, HomeFlashSaleComponent, AdvertiseComponent, HomeSuggestComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
