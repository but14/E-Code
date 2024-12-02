import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // To convert response to JSON
import 'package:woshoesapp/screens/home_screen.dart';
import 'package:woshoesapp/screens/login_screen.dart';
import 'package:woshoesapp/screens/navigation_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  // Function to handle signup
  Future<void> _signup() async {
    final userEmail = _emailController.text;
    final userPhone = _phoneController.text;
    final userName = _usernameController.text;
    final userPassword = _passwordController.text;

    print("Email:  + $userEmail");
    print("Phone: + $userPhone");
    print("Username: $userName");
    print("Password: $userPassword");

    if (userEmail.isEmpty || userPhone.isEmpty || userName.isEmpty || userPassword.isEmpty) {
      _showError('Please fill all fields');
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/api/user/signup'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'user_email': userEmail,
          'user_name': userName,
          'user_password': userPassword,
          'user_phone': userPhone,
        }),
      );

      print("Response status:  ${response.statusCode}");
      print("Response body:  ${response.body}");
      
      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        // Successfully created user
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LoginScreen(),
          ),
        );
      } else {
        // Handle errors (e.g., user already exists)
        _showError(responseData['message']);
      }
    } catch (error) {
      _showError('An error occurred. Please try again.');
    }
  }

  // Function to show error messages
  void _showError(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: Text('Okay'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: SingleChildScrollView(
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: 0),
              Image.asset("images/freed.png"),
              SizedBox(height: 50),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: Column(
                  children: [
                    TextFormField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        labelText: "Enter Email",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _phoneController,
                      decoration: InputDecoration(
                        labelText: "Enter Phone Number",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.phone),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _usernameController,
                      decoration: InputDecoration(
                        labelText: "Enter Username",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: "Enter Password",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.lock),
                        suffixIcon: Icon(Icons.remove_red_eye),
                      ),
                    ),
                    SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: _signup,
                      child: Text(
                        "Create Account",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        minimumSize: Size.fromHeight(55),
                        backgroundColor: Color(0xF7FF9233),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Already have an Account?",
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 15,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => LoginScreen(),
                              ),
                            );
                          },
                          child: Text(
                            "Log In",
                            style: TextStyle(
                              color: Color(0xF7FF9233),
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Create account with",
                          style: TextStyle(
                            color: Colors.orangeAccent,
                            fontSize: 20,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Handle Google login
                          },
                          child: Text(
                            "Google",
                            style: TextStyle(
                              color: Color.fromARGB(247, 63, 16, 255),
                              fontSize: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
