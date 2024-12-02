// const a = [
//     {name : "thinh" , phone : "0969"},
//     {name : "quan" , phone :"1234"}
// ]
// // adđ attribute to object array
// a[0]['sdt'] = 1221
// a.length = 0 
// console.log(a);


// let letter = ["a" ,"b"]

// letter.push(function () {
//     alert(this)  
// })
// letter[2]()

// console.log(letter);



// 2.
// for (var index = 0; index < 4; index++) {
//     console.log(index)  
// }
// console.log(index);
// // liên quan đến closure và sự khác nhau khai báo giữa let và var

//3.
// function twoSum(nums, target) {
//     const numMap = [];  // Khởi tạo hash map
//     for (let i = 0; i < nums.length; i++) {
//         const complement = target - nums[i];
//         if (complement in numMap) {
//             return [numMap[complement], i];
//         }
//         numMap[nums[i]] = i;
//     }
//     return [];
// }

// // Ví dụ sử dụng:
// const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const target = 1 + 2;
// console.log(twoSum(nums, target));  // Kết quả: [4, 9]


