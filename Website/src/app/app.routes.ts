import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShopPageComponent } from './components/shop-page/shop-page.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { UserInfoComponent } from './components/profile-user/components/user-info/user-info.component';
import { OrderHistoryComponent } from './components/profile-user/components/order-history/order-history.component';
import { CartComponent } from './components/cart/cart.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PublicComponent } from './components/public/public.component';
import { AdminShopComponent } from './components/admin-shop/admin-shop.component';
import { DashboardComponent } from './components/admin-shop/components/dashboard/dashboard.component';
import { ProductManagementComponent } from './components/admin-shop/components/product-management/product-management.component';
import { CategoryManagementComponent } from './components/admin-shop/components/category-management/category-management.component';
import { AddProductComponent } from './components/admin-shop/components/add-product/add-product.component';
import { ReviewComponent } from './components/review/review.component';
import { Checkout1Component } from './components/checkout1/checkout1.component';
import { ReviewListComponent } from './components/profile-user/components/review-list/review-list.component';
import { AddCategoryComponent } from './components/admin-shop/components/add-category/add-category.component';

// Guard
import { authGuard } from './auth.guard';
import { checkAdminGuard } from './check-admin.guard';
import { OrderManagementComponent } from './components/admin-shop/components/order-management/order-management.component';
import { DetailOrderComponent } from './components/admin-shop/components/order-management/components/detail-order/detail-order.component';

export const routes: Routes = [
    {path: "", component: PublicComponent, 
        children: [
            {path: "", component: HomeComponent},
            {path: "product-list", component: ProductListComponent, // danh sách sp
                children: [
                    {path: "product-detail/:product_slug", component: ProductDetailComponent}, // chi tiết sp
                ],
            },
            {path: "product-detail/:product_slug", component: ProductDetailComponent}, // chi tiết sp
            {path: "shop-page/:shop_name", component: ShopPageComponent}, // trang của shop
            {path: "profile-user", component: ProfileUserComponent, canActivate:[authGuard], // trang hồ sơ người dùng
                children: [
                    {path: 'info', component: UserInfoComponent},
                    {path: 'order-history', component: OrderHistoryComponent,
                        children: [
                            {path: 'review', component: ReviewComponent},
                        ],
                    },
                    {path: 'order-history', component: OrderHistoryComponent},
                    {path: 'review-list', component: ReviewListComponent},
                ],
            },
            {path: "cart", component: CartComponent, canActivate : [authGuard]}, // trang giỏ hàng
            {path: "checkout", component: Checkout1Component, canActivate: [authGuard],},
            // {path: "review", component: ReviewComponent},
        ],
    },
    {path: "admin-shop", component: AdminShopComponent, canActivate: [checkAdminGuard],
        children: [
            {path: "", component: DashboardComponent},
            {path: "dashboard", component: DashboardComponent},
            {path: "product-management", component: ProductManagementComponent,
                children: [
                    {path: "add-product", component: AddProductComponent},
                ],
            },
            {path: "category-management", component: CategoryManagementComponent,
                children: [
                    {path: "add-category", component: AddCategoryComponent},
                ],
            },
            {path: "order-management", component: OrderManagementComponent,
                children: [
                    {path: 'detail-order', component: DetailOrderComponent},
                ],
            },
            {path: "add-product", component: AddProductComponent},
            {path: "add-category", component: AddCategoryComponent},
        ],
    }, // trang admin của shop
    {path: "sign-in", component: SignInComponent}, // trang đăng nhập
    {path: "sign-up", component: SignUpComponent}, // trang đăng ký
    //{path : "checkout", component : CheckoutComponent},

    {path: "**", component: NotFoundComponent} // route Not Found nên ở cuối cùng
];
