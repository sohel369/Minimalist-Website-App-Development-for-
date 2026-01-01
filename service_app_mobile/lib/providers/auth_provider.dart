import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = false;
  String? _verificationId;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get verificationId => _verificationId;

  AuthProvider() {
    _authService.authStateChanges.listen((User? user) {
      _user = user;
      notifyListeners();
    });
  }

  void setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  // Step 1: Send OTP
  Future<void> signInWithPhone(String phoneNumber) async {
    setLoading(true);
    try {
      await _authService.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        onVerificationCompleted: (PhoneAuthCredential credential) async {
          // Android only: Auto-verification
          await _authService.signInWithOTP(
              verificationId: _verificationId!, smsCode: credential.smsCode!);
          setLoading(false);
        },
        onVerificationFailed: (FirebaseAuthException e) {
          setLoading(false);
          // We can't easily throw to the caller here since it's a callback.
          // In a real app, we might set an error state or use a Completer.
          // For now, we'll just log it or set a local error state if we had one.
          print("Verification Failed: ${e.message}");
          throw e;
        },
        onCodeSent: (String verificationId, int? resendToken) {
          _verificationId = verificationId;
          setLoading(false);
        },
        onCodeAutoRetrievalTimeout: (String verificationId) {
          _verificationId = verificationId;
        },
      );
    } catch (e) {
      setLoading(false);
      rethrow;
    }
  }

  // Step 2: Verify OTP
  Future<bool> verifyOTP(String smsCode) async {
    if (_verificationId == null) return false;

    setLoading(true);
    try {
      await _authService.signInWithOTP(
        verificationId: _verificationId!,
        smsCode: smsCode,
      );
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      return false;
    }
  }

  Future<void> signOut() async {
    await _authService.signOut();
  }
}
