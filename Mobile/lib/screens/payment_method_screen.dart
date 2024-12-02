import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:woshoesapp/screens/tracking_screen.dart';
import 'package:woshoesapp/widget/container_button_model.dart';

class PaymentMethodScreen extends StatefulWidget {
  final double totalAmount;

  const PaymentMethodScreen({Key? key, required this.totalAmount})
      : super(key: key);

  @override
  State<PaymentMethodScreen> createState() => _PaymentMethodScreenState();
}

class _PaymentMethodScreenState extends State<PaymentMethodScreen> {
  final FlutterSecureStorage storage = FlutterSecureStorage();
  int _type = 1; // Default payment method: STRIPE
  double shippingCost = 50000; // Default shipping cost

  // TextEditingControllers for each part of the address
  final TextEditingController _districtController = TextEditingController();
  final TextEditingController _provinceController = TextEditingController();
  final TextEditingController _streetController = TextEditingController();
  final TextEditingController _wardController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();

  void _handleRadio(Object? e) => setState(() {
        _type = e as int;
      });

  @override
  void dispose() {
    _nameController.dispose();
    _districtController.dispose();
    _provinceController.dispose();
    _streetController.dispose();
    _wardController.dispose();
    super.dispose();
  }

  void _confirmPayment() async {
    // Validate input
    if (_nameController.text.isEmpty ||
        _districtController.text.isEmpty ||
        _provinceController.text.isEmpty ||
        _streetController.text.isEmpty ||
        _wardController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please enter all parts of your shipping address."),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    String paymentMethod = '';
    if (_type == 1) {
      paymentMethod = 'STRIPE';
    } else if (_type == 2) {
      paymentMethod = 'VN PAY';
    } else if (_type == 3) {
      paymentMethod = 'Cash On Delivery (COD)';
    }

    List<Map<String, dynamic>> orderDetails = [
      {
        'product_id': '67481268e02f34af1fc03c01',
        'variant_id': '67481268e02f34af1fc03c02',
        'quantity': 1,
        'unit_price': 480000,
      }
    ];

    final orderData = {
      'order_total_cost': widget.totalAmount + shippingCost,
      'order_buyer': _nameController.text,
      'order_address': {
        'district': _districtController.text,
        'province': _provinceController.text,
        'street': _streetController.text,
        'ward': _wardController.text
      },
      'order_details': orderDetails,
      'order_payment_method': paymentMethod,
    };

    //Log
    print("Order data: ${json.encode(orderData)} ");

    try {
      String? token = await storage.read(key: 'token');
      if (token == null) {
        print("User is not logged in.");
        return;
      }

      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/api/orders/create'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(orderData),
      );

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              "Order placed successfully! Order ID: ${responseData['data']['_id']}",
            ),
            duration: const Duration(seconds: 2),
          ),
        );

        if (_type == 3) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const OrderTrackingScreen(),
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Failed to place order: ${response.body}"),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error: $error"),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    double finalTotal = widget.totalAmount + shippingCost;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Payment Method"),
        leading: const BackButton(),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 30),
                _buildTextInputField(
                  controller: _nameController,
                  label: "Name",
                  hintText: "Enter your name",
                ),
                const SizedBox(height: 15),
                _buildTextInputField(
                  controller: _districtController,
                  label: "District",
                  hintText: "Enter your district",
                ),
                const SizedBox(height: 15),
                _buildTextInputField(
                  controller: _provinceController,
                  label: "Province",
                  hintText: "Enter your province",
                ),
                const SizedBox(height: 15),
                _buildTextInputField(
                  controller: _streetController,
                  label: "Street",
                  hintText: "Enter your street",
                ),
                const SizedBox(height: 15),
                _buildTextInputField(
                  controller: _wardController,
                  label: "Ward",
                  hintText: "Enter your ward",
                ),
                const SizedBox(height: 30),
                _buildPaymentOption(size: size, value: 1, label: "STRIPE"),
                const SizedBox(height: 15),
                _buildPaymentOption(size: size, value: 2, label: "VN PAY"),
                const SizedBox(height: 15),
                _buildPaymentOption(size: size, value: 3, label: "COD"),
                const SizedBox(height: 30),
                _buildSummaryRow("Subtotal", "${widget.totalAmount} VNĐ"),
                const SizedBox(height: 15),
                _buildSummaryRow("Shipping", "${shippingCost} VNĐ"),
                const Divider(height: 30, color: Colors.black),
                _buildSummaryRow(
                  "Total",
                  "${finalTotal} VNĐ",
                  isHighlighted: true,
                ),
                const SizedBox(height: 70),
                InkWell(
                  onTap: _confirmPayment,
                  child: ContainerButtonModel(
                    itext: "Confirm Payment",
                    containerWidth: size.width,
                    bgColor: const Color(0xFFDB3022),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextInputField({
    required TextEditingController controller,
    required String label,
    required String hintText,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required Size size,
    required int value,
    required String label,
  }) {
    return Container(
      width: size.width,
      height: 55,
      decoration: BoxDecoration(
        border: Border.all(
          width: _type == value ? 1 : 0.5,
          color: _type == value ? const Color(0xFFDB3022) : Colors.grey,
        ),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Row(
        children: [
          Radio(
            value: value,
            groupValue: _type,
            onChanged: _handleRadio,
            activeColor: const Color(0xFFDB3022),
          ),
          Text(label),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value,
      {bool isHighlighted = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Text(
          value,
          style: TextStyle(
            color: isHighlighted ? const Color(0xFFDB3022) : Colors.black,
          ),
        ),
      ],
    );
  }
}
