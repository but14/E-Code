class Product {
  final String? productId;
  final String? productName;
  final String? productImg;
  final String? categoryName; // Replacing productBrand
  final String? productDescription; // Add this field
  final double? rating; // Add this field if needed
  final double? price;

  Product({
    this.productId,
    this.productName,
    this.productImg,
    this.categoryName,
    this.productDescription,
    this.rating,
    this.price,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      productId: json['_id'],
      productName: json['product_name'],
      productImg: json['product_img'],
      categoryName: json['category_name'], // Updated to match the API
      productDescription: json['product_description'], // Add this mapping
      rating: (json['rating'] as num?)?.toDouble(), // Ensure double type
      price: (json['price'] as num?)?.toDouble(), // Ensure double type
    );
  }
}
