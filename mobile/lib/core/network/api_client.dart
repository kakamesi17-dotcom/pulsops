import 'package:dio/dio.dart';

class ApiClient {
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Android Emulator alias or localhost
  final Dio _dio;

  ApiClient({String? authToken})
      : _dio = Dio(BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
          headers: {
            'Content-Type': 'application/json',
            if (authToken != null) 'Authorization': 'Bearer $authToken',
          },
        ));

  Dio get client => _dio;
}
