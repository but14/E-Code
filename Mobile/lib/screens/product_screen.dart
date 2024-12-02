import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:woshoesapp/widget/product_details.dart';
import 'package:woshoesapp/model/product.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ProductScreen extends StatefulWidget {
  final Product product;

  ProductScreen({required this.product});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  int _currentImageIndex = 0; // Theo dõi ảnh hiện tại trong PageView
  final FlutterSecureStorage storage = FlutterSecureStorage();

  // Hàm để thêm sản phẩm vào giỏ hàng
  Future<void> _addToCart() async {
    // Lấy token từ Secure Storage
    String? token = await storage.read(key: 'token');
    
    if (token == null) {
      // Nếu không có token, thông báo lỗi
      _showError('Please log in to add products to the cart.');
      return;
    }

    // Địa chỉ API để thêm vào giỏ hàng
    final String url = 'http://10.0.2.2:3000/api/user/cart/createM';

    // Gửi yêu cầu POST đến API
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',  // Gửi token trong header
        },
        body: json.encode({
          'product': widget.product.productId,  // Lấy productId từ đối tượng product
        }),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        _showSuccessMessage(responseData['message']);
      } else {
        _showError(responseData['message'] ?? 'Failed to add product to cart');
      }
    } catch (error) {
      _showError('An error occurred. Please try again.');
    }
  }

  // Hàm hiển thị thông báo lỗi
  void _showError(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  // Hàm hiển thị thông báo thành công
  void _showSuccessMessage(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Success'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Sử dụng fallback image khi productImg không có
    String image = widget.product.productImg ?? 'https://example.com/default-image.jpg';
    List<String> images = [image]; // Bạn có thể thêm nhiều ảnh vào đây nếu có

    return Scaffold(
      appBar: AppBar(
        title: const Text("Product Overview"),
        leading: const BackButton(),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Image slider cho sản phẩm sử dụng PageView
                SizedBox(
                  height: 450,
                  width: MediaQuery.of(context).size.width,
                  child: Stack(
                    alignment: Alignment.bottomCenter,
                    children: [
                      PageView.builder(
                        itemCount: images.length, // Số lượng ảnh
                        onPageChanged: (index) {
                          setState(() {
                            _currentImageIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          return Image.network(
                            images[index],
                            fit: BoxFit.cover,
                          );
                        },
                      ),
                      // Indicator cho PageView
                      Positioned(
                        bottom: 10,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(images.length, (index) {
                            return Container(
                              margin: const EdgeInsets.symmetric(horizontal: 5),
                              width: _currentImageIndex == index ? 12 : 8,
                              height: _currentImageIndex == index ? 12 : 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _currentImageIndex == index
                                    ? Colors.orange
                                    : Colors.grey,
                              ),
                            );
                          }),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Tên sản phẩm, danh mục và giá
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.product.productName ?? 'Unknown Product',
                          style: const TextStyle(
                            color: Colors.black87,
                            fontWeight: FontWeight.w900,
                            fontSize: 25,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          widget.product.categoryName ?? 'Unknown Category',
                          style: const TextStyle(
                            color: Colors.black54,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      "\$${widget.product.price?.toStringAsFixed(2) ?? '0.00'}",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 25,
                        color: Color(0xFFDB3022),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Placeholder cho rating (nếu API không cung cấp rating)
                Align(
                  alignment: Alignment.centerLeft,
                  child: RatingBar.builder(
                    initialRating: 0.0, // Rating mặc định vì API không cung cấp
                    minRating: 1,
                    direction: Axis.horizontal,
                    allowHalfRating: true,
                    itemCount: 5,
                    itemSize: 25,
                    itemPadding: const EdgeInsets.symmetric(horizontal: 1.0),
                    itemBuilder: (context, _) => const Icon(
                      Icons.star,
                      color: Color.fromARGB(255, 245, 188, 0),
                    ),
                    onRatingUpdate: (rating) {
                      print(rating);
                    },
                  ),
                ),
                const SizedBox(height: 10),

                // Mô tả sản phẩm
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    widget.product.productDescription ?? 'No description available',
                    style: const TextStyle(
                      color: Colors.black54,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(height: 30),

                // Nút hành động
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Nút thêm vào giỏ hàng
                    GestureDetector(
                      onTap: _addToCart,
                      child: Container(
                        height: 60,
                        width: 60,
                        decoration: BoxDecoration(
                          color: const Color(0x1F989797),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.shopping_cart,
                            color: Color(0xFFDB3022),
                          ),
                        ),
                      ),
                    ),
                    ProductDetailsPopup(),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
