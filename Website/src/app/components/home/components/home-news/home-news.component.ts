import { Component } from '@angular/core';

@Component({
  selector: 'app-home-news',
  standalone: true,
  imports: [],
  templateUrl: './home-news.component.html',
  styleUrl: './home-news.component.css'
})
export class HomeNewsComponent {

constructor() {
  
}

z = function(x: number, y: string) : string {
  return `Chao ${y}, nam nay ban ${x} tuoi phai khong?`;
}

}
