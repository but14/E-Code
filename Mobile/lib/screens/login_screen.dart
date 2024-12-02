import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // To convert the response to JSON
import 'package:woshoesapp/screens/navigation_screen.dart';
import 'package:woshoesapp/screens/signup_screen.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscureText = true; // To manage the visibility of password
  bool _isLoading = false; // To show a loading indicator while logging in

  final storage = FlutterSecureStorage();
  // Function to handle login
  Future<void> _login() async {
    final userEmail = _usernameController.text;
    final userPassword = _passwordController.text;

    if (userEmail.isEmpty || userPassword.isEmpty) {
      _showError('Please fill all fields');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse(
            'http://10.0.2.2:3000/api/user/signin'), // Thay đổi URL theo API của bạn
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'user_email': userEmail,
          'user_password': userPassword,
        }),
      );

      final responseData = json.decode(response.body);

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        final token = responseData['data']['token'];

        print("Reveal token:  $token");

        // Lưu token vào Secure Storage
        await storage.write(key: 'token', value: token);

        // Hiển thị thông báo thành công
        _showSuccessMessage(userEmail);

        // Chuyển hướng sang màn hình chính
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => NavigationScreen(),
          ),
        );
      } else {
        _showError(responseData['message'] ?? 'An error occurred');
      }
    } catch (error) {
      setState(() {
        _isLoading = false;
      });
      _showError('An error occurred. Please try again.');
    }
  }

  void _showSuccess(String message) {
    // Show a success message on the screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _showError(String message) {
    // Show an error message on the screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  void _showSuccessMessage(String userEmail) {
    // You can display a success message for the user email or login here.
    _showSuccess('Login successful for $userEmail');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Ensure Scaffold is used here to avoid ScaffoldMessenger error

      body: SingleChildScrollView(
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: 120),
              Image.asset("images/freed.png"),
              SizedBox(height: 50),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: Column(
                  children: [
                    TextFormField(
                      controller: _usernameController,
                      decoration: InputDecoration(
                        labelText: "Enter Email",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscureText,
                      decoration: InputDecoration(
                        labelText: "Enter Password",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureText
                                ? Icons.remove_red_eye
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscureText = !_obscureText;
                            });
                          },
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: TextButton(
                        onPressed: () {
                          // Handle password recovery
                        },
                        child: Text(
                          "Forgot password?",
                          style: TextStyle(
                            color: Color(0xF7FF9233),
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _isLoading
                          ? null
                          : _login, // Disable button while loading
                      child: _isLoading
                          ? CircularProgressIndicator() // Show loading indicator
                          : Text(
                              "Log In",
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
                          "Don't have an Account?",
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
                                builder: (context) => SignupScreen(),
                              ),
                            );
                          },
                          child: Text(
                            "Sign Up",
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
                          "Login with",
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
