import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:woshoesapp/screens/product_screen.dart';
import 'package:woshoesapp/model/product.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<String> categories = ["All"]; // Initial category list with "All"
  List<Product> products = [];
  List<Product> filteredProducts = []; // For category-specific filtering
  bool isLoading = true;
  String selectedCategory = "All";

  // Fetch categories from API
  Future<void> fetchCategories() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:3000/api/category/getNameCategory_full'),
      );

      // Log raw response for debugging
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        setState(() {
          // Decode JSON response
          final decodedResponse =
              json.decode(response.body) as Map<String, dynamic>;
          final categoryData = decodedResponse['data'] as List<dynamic>;

          // Map categories from the "data" field
          categories.addAll(
            categoryData.map((category) => category['category_name'] as String),
          );

          // Log the parsed categories
          print('Parsed categories: $categories');
        });
      } else {
        // Log error response
        print(
            'Failed to fetch categories. Status code: ${response.statusCode}');
        throw Exception('Failed to load categories');
      }
    } catch (e) {
      // Log exception
      print('Error fetching categories: $e');
    }
  }

  // Fetch products from API
  Future<void> fetchProducts() async {
    try {
      final response =
          await http.get(Uri.parse('http://10.0.2.2:3000/api/getAllProducts'));

      if (response.statusCode == 200) {
        setState(() {
          products = (json.decode(response.body) as List)
              .map((data) => Product.fromJson(data))
              .toList();
          filteredProducts = products; // Initially, show all products
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print('Error fetching products: $e');
    }
  }

  // Filter products by category
  void filterProducts(String category) {
    setState(() {
      if (category == "All") {
        filteredProducts = products;
      } else {
        filteredProducts = products
            .where((product) => product.categoryName == category)
            .toList();
      }
      selectedCategory = category;
    });
  }

  @override
  void initState() {
    super.initState();
    fetchCategories();
    fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15, top: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search bar and notifications
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: EdgeInsets.all(5),
                    height: 50,
                    width: MediaQuery.of(context).size.width / 1.5,
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: TextFormField(
                      decoration: InputDecoration(
                        prefixIcon: Icon(
                          Icons.search,
                          color: Color(0xF7FF9233),
                        ),
                        border: InputBorder.none,
                        label: Text("Find your product"),
                      ),
                    ),
                  ),
                  Container(
                    height: 50,
                    width: MediaQuery.of(context).size.width / 6,
                    decoration: BoxDecoration(
                      color: Colors.black12.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12.withOpacity(0.05),
                          blurRadius: 2,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        Icons.notifications,
                        color: Color(0xF7FF9233),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20),
              // Featured image
              Container(
                height: 150,
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                  color: Color(0xFFFFF0DD),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 1,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Image.asset("images/freed.png"),
              ),
              SizedBox(height: 20),
              // Category list
              SizedBox(
                height: 50,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () => filterProducts(categories[index]),
                      child: Container(
                        height: 40,
                        margin: EdgeInsets.all(8),
                        padding: EdgeInsets.symmetric(horizontal: 15),
                        decoration: BoxDecoration(
                          color: selectedCategory == categories[index]
                              ? Color(0xFFFFF0DD)
                              : Colors.black12.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Center(
                          child: Text(
                            categories[index],
                            style: TextStyle(
                              color: selectedCategory == categories[index]
                                  ? Colors.black
                                  : Colors.black38,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              SizedBox(height: 20),
              // Product grid
              Expanded(
                child: isLoading
                    ? Center(child: CircularProgressIndicator())
                    : filteredProducts.isEmpty
                        ? Center(child: Text("No products available"))
                        : GridView.builder(
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                              childAspectRatio: 0.75,
                            ),
                            itemCount: filteredProducts.length,
                            itemBuilder: (context, index) {
                              final product = filteredProducts[index];
                              return GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          ProductScreen(product: product),
                                    ),
                                  );
                                },
                                child: Column(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: Image.network(
                                        product.productImg ??
                                            'https://example.com/default_image.jpg',
                                        fit: BoxFit.cover,
                                        height: 150,
                                        width: double.infinity,
                                      ),
                                    ),
                                    SizedBox(height: 10),
                                    Text(
                                      product.productName ?? 'Unnamed Product',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    SizedBox(height: 3),
                                    Text(
                                      '${product.price}'+' VNĐ',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFFDB3022),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
