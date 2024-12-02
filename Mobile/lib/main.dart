import 'package:flutter/material.dart';
import 'package:woshoesapp/model/route_observer.dart';
import 'package:woshoesapp/screens/navigation_screen.dart';

import 'package:woshoesapp/screens/splash_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "WoShoes",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Color(0xFFDB3022),
      ),
      home: SplashScreen(),
      navigatorObservers: [RouteObserverSingleton.routeObserver],
      
    );
  }
}
