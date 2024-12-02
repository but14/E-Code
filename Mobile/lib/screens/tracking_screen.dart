import 'package:flutter/material.dart';

class OrderTrackingScreen extends StatefulWidget {
  const OrderTrackingScreen({super.key});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Order Tracking"),
        leading: const BackButton(),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Title
              const SizedBox(height: 30),

              // Order Status Timeline
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildStatusStep(
                    icon: Icons.shopping_cart,
                    status: "Order Placed",
                    color: Colors.teal,
                    isActive: true,
                  ),
                  _buildConnector(isActive: true), // Nối với trạng thái tiếp theo
                  _buildStatusStep(
                    icon: Icons.local_shipping,
                    status: "In Transit",
                    color: Colors.orange,
                    isActive: true,
                  ),
                  _buildConnector(isActive: false), // Nối với trạng thái tiếp theo
                  _buildStatusStep(
                    icon: Icons.check_circle,
                    status: "Completed",
                    color: Colors.grey,
                    isActive: false,
                  ),
                ],
              ),
              
              const SizedBox(height: 30), // Khoảng cách giữa tiến trình và thông tin sản phẩm

              // Card để hiển thị thông tin sản phẩm
              Card(
                elevation: 5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(15),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Product Information",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Icon(Icons.shopping_bag, color: Colors.teal, size: 30),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text(
                                "Product Name",
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                              ),
                              SizedBox(height: 5),
                              Text(
                                "Price: \$29.99",
                                style: TextStyle(fontSize: 14, color: Colors.grey),
                              ),
                              SizedBox(height: 5),
                              Text(
                                "Quantity: 1",
                                style: TextStyle(fontSize: 14, color: Colors.grey),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Hàm tạo các bước trạng thái
  Widget _buildStatusStep({
    required IconData icon,
    required String status,
    required Color color,
    required bool isActive,
  }) {
    return Column(
      children: [
        CircleAvatar(
          radius: 20,
          backgroundColor: isActive ? color : Colors.grey[300],
          child: Icon(icon, size: 18, color: isActive ? Colors.white : Colors.grey),
        ),
        const SizedBox(height: 5),
        Text(
          status,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: isActive ? color : Colors.grey,
          ),
        ),
      ],
    );
  }

  // Hàm tạo thanh nối giữa các bước
  Widget _buildConnector({required bool isActive}) {
    return Container(
      width: 30,
      height: 2,
      color: isActive ? Colors.orange : Colors.grey, // Màu thanh nối
    );
  }
}
