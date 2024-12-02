import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environments';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  constructor(
    private router:Router
  ){}

  parentCategories : any
  baseUrl = environment.baseUrl

  ngOnInit(){
    this.parentCategories = environment.parentCategories
  }

  search_categoryParent(categoryParent_name : string){
    console.log(categoryParent_name);
    this.router.navigate(["/product-list"] , { queryParams : { search_query_category : categoryParent_name , page : 1 , sortBy : '' }})
  }

}
