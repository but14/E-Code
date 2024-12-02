
import 'package:animated_bottom_navigation_bar/animated_bottom_navigation_bar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:woshoesapp/screens/cart_screen.dart';

import 'package:woshoesapp/screens/home_screen.dart';
import 'package:woshoesapp/screens/mall_screen.dart';
import 'package:woshoesapp/screens/profile_screen.dart';
import 'package:woshoesapp/screens/tracking_screen.dart';

class NavigationScreen extends StatefulWidget {
  const NavigationScreen({super.key});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  int pageIndex = 0;

  // Danh sách các màn hình
  final List<Widget> pages = [
    HomeScreen(),
    MallScreen(),
    OrderTrackingScreen(),
    CartScreen(),
    
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: pageIndex,
        children: pages,
      ),
      // Bỏ FloatingActionButton
      bottomNavigationBar: AnimatedBottomNavigationBar(
        // Danh sách các icon
        icons: [
          CupertinoIcons.home,
          Icons.storefront,
          Icons.local_shipping,
          CupertinoIcons.cart,
          
          CupertinoIcons.person,
        ],
        inactiveColor: Colors.black.withOpacity(0.5),
        activeColor: Colors.amber[900],
        activeIndex: pageIndex,
        notchSmoothness: NotchSmoothness.smoothEdge,
        iconSize: 28,
        leftCornerRadius: 20,
        rightCornerRadius: 20,
        elevation: 5,
        backgroundColor: Colors.white,
        gapLocation: GapLocation.none, // Không có khoảng trống
        onTap: (index) {
          setState(() {
            pageIndex = index; // Cập nhật chỉ mục hiện tại
          });
        },
      ),
    );
  }
}
