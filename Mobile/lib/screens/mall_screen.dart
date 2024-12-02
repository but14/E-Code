import 'package:flutter/material.dart';

class MallScreen extends StatelessWidget {
  final List<Map<String, dynamic>> products = [
    {
      "name": "Galaxy A55 5G",
      
      "price": 8721000,
      "sold": "1.9k",
      "rating": 4.6,
      "discount": "-6%",
    },
    {
      "name": "Galaxy A06 (4GB/128GB)",
      
      "price": 3231000,
      "sold": "443",
      "rating": 4.8,
      "discount": null,
    },
    {
      "name": "Galaxy S24 Ultra",
      
      "price": 20900000,
      "sold": "900",
      "rating": 4.9,
      "discount": "-10%",
    },
    {
      "name": "Galaxy A05s (4GB/128GB)",
      
      "price": 3500000,
      "sold": "600",
      "rating": 4.7,
      "discount": "-5%",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.redAccent,
        title: const Text("WolfTech"),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.search),
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tabs Section
          _buildTabs(),
          const SizedBox(height: 10),

          // Product List Section
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(10),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 0.7,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return _buildProductCard(product);
              },
            ),
          ),
        ],
      ),
    );
  }

  // Tabs Widget
  Widget _buildTabs() {
    return Container(
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildTab("Phổ biến", isSelected: true),
            _buildTab("Mới nhất"),
            _buildTab("Bán chạy"),
            _buildTab("Giá"),
          ],
        ),
      ),
    );
  }

  // Tab Item Widget
  Widget _buildTab(String label, {bool isSelected = false}) {
    return GestureDetector(
      onTap: () {
        // Add logic for tab switching if needed
      },
      child: Text(
        label,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: isSelected ? Colors.redAccent : Colors.black54,
        ),
      ),
    );
  }

  // Product Card Widget
  Widget _buildProductCard(Map<String, dynamic> product) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 5,
            spreadRadius: 2,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Image
          // ClipRRect(
          //   borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
          //   child: Image.network(
          //     product["imageUrl"],
          //     height: 120,
          //     width: double.infinity,
          //     fit: BoxFit.cover,
          //   ),
          // ),

          // Product Info
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product["name"],
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 5),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "${product["price"]} đ",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.redAccent,
                        fontSize: 14,
                      ),
                    ),
                    if (product["discount"] != null)
                      Text(
                        product["discount"]!,
                        style: const TextStyle(
                          color: Colors.green,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 5),
                Text(
                  "Đã bán: ${product["sold"]}",
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 5),
                Row(
                  children: [
                    Icon(
                      Icons.star,
                      color: Colors.yellow[700],
                      size: 16,
                    ),
                    Text(
                      " ${product["rating"]}",
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
