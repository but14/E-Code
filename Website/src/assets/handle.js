// Di chuyển slide news
var btnLeftSlideNewsID = document.getElementById('btnLeftSlideNewsID');
var btnRightSlideNewsID = document.getElementById('btnRightSlideNewsID');
var slideNewsImage = document.getElementById('slideNewsImageID');
// 
btnLeftSlideNewsID.addEventListener('click', function(){
    if(slideNewsImage.scrollLeft <= 0){
        slideNewsImage.scrollLeft = slideNewsImage.offsetWidth * 5
    }else{
        slideNewsImage.scrollLeft = slideNewsImage.scrollLeft - slideNewsImage.offsetWidth
    }
})
btnRightSlideNewsID.addEventListener('click', function(){
    if(slideNewsImage.scrollLeft >= slideNewsImage.offsetWidth * 5){
        slideNewsImage.scrollLeft = 0
    }else{
        slideNewsImage.scrollLeft = slideNewsImage.scrollLeft + slideNewsImage.offsetWidth
    }
})
// tự động chuyển slide news
const autoMoveNewsSlide = () => {
    if(slideNewsImage.scrollLeft >= slideNewsImage.offsetWidth * 5){
        slideNewsImage.scrollLeft = 0
    }else{
        slideNewsImage.scrollLeft = slideNewsImage.scrollLeft + slideNewsImage.offsetWidth;
    }
};
let setAutoMoveNewsSlide = setInterval(autoMoveNewsSlide, 4000);
// Hết phần di chuyển slide news

// Di chuyển slide Category 
var btnMoveCategoryLeft = document.getElementById('btnMoveCategoryLeftID');
var btnMoveCategoryRight = document.getElementById('btnMoveCategoryRightID');
var listCategory = document.getElementById('listCategoryID');
let btnCategory = document.getElementsByClassName('btnCategory');

btnMoveCategoryLeft.addEventListener('click', function(){
    // if(listCategory.scrollLeft <= 0){
    //     listCategory.scrollLeft = listCategory.offsetWidth * 3
    // }else{
    //     listCategory.scrollLeft = listCategory.offsetWidth / 2
    // }
    listCategory.scrollLeft = listCategory.scrollLeft - (btnCategory[0].offsetWidth * 4);
})
btnMoveCategoryRight.addEventListener('click', function(){
    listCategory.scrollLeft = listCategory.scrollLeft + (btnCategory[0].offsetWidth * 4);
})

// Hết phần di chuyển slide category

// Di chuyển slide Flash Sale
let btnMoveFlashSaleLeft = document.getElementById('btnMoveFlashSaleLeftID');
let btnMoveFlashSaleRight = document.getElementById('btnMoveFlashSaleRightID');
let listFlashSale = document.getElementById('listFlashSaleID');
let btnFlashSale = document.getElementsByClassName('btnFlashSale');

btnMoveFlashSaleLeft.addEventListener('click', function(){
    listFlashSale.scrollLeft = listFlashSale.scrollLeft - (btnFlashSale[0].offsetWidth * 3);
})
btnMoveFlashSaleRight.addEventListener('click', function(){
    listFlashSale.scrollLeft = listFlashSale.scrollLeft + (btnFlashSale[0].offsetWidth * 3);
})
// Hết phần di chuyển slide Flash Sale

// Slide hình trong chi tiết sản phẩm

// hết phần slide hình trong chi tiết sản phẩm