
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:woshoesapp/model/route_observer.dart';
import 'dart:convert';
import 'package:woshoesapp/screens/payment_method_screen.dart';
import 'package:woshoesapp/widget/container_button_model.dart';

class CartScreen extends StatefulWidget {
  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> with RouteAware {
  final FlutterSecureStorage storage = FlutterSecureStorage();
  List<dynamic> cartItems = [];
  bool isLoading = true;
  bool selectAll = false;
  double totalAmount = 0.0;

  // Fetch the cart data from API
  Future<void> fetchCartData() async {
    try {
      String? token = await storage.read(key: 'token');
      if (token == null) {
        print("User is not logged in.");
        return;
      }

      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/api/user/cartM'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('Data: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          cartItems = data['data'];
          for (var item in cartItems) {
            item['selected'] = false; // Ensure items are initially not selected
          }
          totalAmount = _calculateTotalAmount();
          isLoading = false;
        });
      } else {
        print('Failed to load cart data: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  // Delete product from cart
  Future<void> deleteProductFromCart(int index) async {
    try {
      String? token = await storage.read(key: 'token');
      if (token == null) {
        print("User is not logged in.");
        return;
      }

      final cartItem = cartItems[index];
      if (cartItem['product'] == null) {
        print('Error: Product not found index $index');
        return;
      }

      final productId = cartItem['product']['_id'];
      if (productId == null) {
        print("Product ID is null.");
        return;
      }

      // Validate ObjectId before sending request
      if (!isValidObjectId(productId)) {
        print("Invalid Product ObjectId");
        return;
      }

      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/api/user/cart/deleteM'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'product': productId, // Ensure sending correct ObjectId
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print("Product deleted: ${data['message']}");
        setState(() {
          cartItems.removeAt(index);
          totalAmount = _calculateTotalAmount();
        });
      } else {
        print('Failed to delete product: ${response.statusCode}');
        print('Response: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  // Validate ObjectId (24 hex characters)
  bool isValidObjectId(String id) {
    final regex = RegExp(r'^[0-9a-fA-F]{24}$');
    return regex.hasMatch(id);
  }

  // Calculate total amount for selected items
  double _calculateTotalAmount() {
    double total = 0.0;
    for (var item in cartItems) {
      if (item['selected'] == true) {
        final product = item['product'];
        final price = double.tryParse(product['product_variants'][0]['price'].toString()) ?? 0.0;
        final quantity = item['quantity'];
        total += price * quantity;
      }
    }
    return total;
  }

  // Toggle selection for "Select All"
  void toggleSelectAll(bool? value) {
    setState(() {
      selectAll = value ?? false;
      for (var item in cartItems) {
        item['selected'] = selectAll;
      }
      totalAmount = _calculateTotalAmount();
    });
  }

  // Toggle individual item selection
  void toggleItemSelection(int index) {
    setState(() {
      cartItems[index]['selected'] = !cartItems[index]['selected'];
      totalAmount = _calculateTotalAmount();
    });
  }

  // Delete item from cart
  void deleteItem(int index) {
    setState(() {
      cartItems.removeAt(index);
      totalAmount = _calculateTotalAmount();
    });
  }

  

  @override
  void initState() {
    super.initState();
    fetchCartData();
    
  }

  @override
  void didPopNext() {
    
    fetchCartData();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Cart"),
        leading: BackButton(),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(15),
                child: Column(
                  children: [
                    ListView.builder(
                      itemCount: cartItems.length,
                      shrinkWrap: true,
                      scrollDirection: Axis.vertical,
                      physics: NeverScrollableScrollPhysics(),
                      itemBuilder: (context, index) {
                        final cartItem = cartItems[index];
                        final product = cartItem['product'];

                        return Container(
                          margin: EdgeInsets.symmetric(vertical: 15),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Checkbox(
                                splashRadius: 20,
                                activeColor: Color(0xFFDB3022),
                                value: cartItem['selected'] ?? false,
                                onChanged: (val) {
                                  toggleItemSelection(index);
                                },
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product['product_name'],
                                    style: TextStyle(
                                      color: Colors.black87,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 18,
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text(
                                    "${product['product_variants'][0]['price']}"+" VNĐ",
                                    style: TextStyle(
                                      color: Color(0xFFDB3022),
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: () {
                                      // Decrement quantity
                                      setState(() {
                                        if (cartItem['quantity'] > 1) {
                                          cartItem['quantity']--;
                                          totalAmount = _calculateTotalAmount();
                                        }
                                      });
                                    },
                                    child: Icon(CupertinoIcons.minus, color: Colors.green),
                                  ),
                                  SizedBox(width: 10),
                                  Text(
                                    cartItem['quantity'].toString(),
                                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                                  ),
                                  SizedBox(width: 10),
                                  GestureDetector(
                                    onTap: () {
                                      // Increment quantity
                                      setState(() {
                                        cartItem['quantity']++;
                                        totalAmount = _calculateTotalAmount();
                                      });
                                    },
                                    child: Icon(CupertinoIcons.plus, color: Color(0xFFDB3022)),
                                  ),
                                ],
                              ),
                              IconButton(
                                icon: Icon(CupertinoIcons.trash, color: Colors.red),
                                onPressed: () async {
                                  await deleteProductFromCart(index);
                                },
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Select All", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                        Checkbox(
                          splashRadius: 20,
                          activeColor: Color(0xFFDB3022),
                          value: selectAll,
                          onChanged: toggleSelectAll,
                        ),
                      ],
                    ),
                    Divider(height: 20, thickness: 1, color: Colors.black),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Total Payment", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                        Text(
                          "${totalAmount.toStringAsFixed(2)}" + " VNĐ",
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFDB3022)),
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => PaymentMethodScreen(totalAmount: totalAmount,)),
                        );
                      },
                      child: ContainerButtonModel(
                        itext: "Checkout",
                        containerWidth: MediaQuery.of(context).size.width,
                        bgColor: Color(0xFFDB3022),
                      ),
                    ),
                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),
    );
  }
}
