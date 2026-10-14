import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:url_launcher/url_launcher.dart';

class UpdateService {
  static const String currentVersion = "1.0.0";
  static const int currentBuildNumber = 1;
  static const String updateCheckUrl = "https://web-pi-two-15.vercel.app/version.json";

  static Future<void> checkForUpdates(BuildContext context, {bool showNoUpdateToast = false}) async {
    try {
      final dio = Dio(BaseOptions(
        connectTimeout: const Duration(seconds: 6),
        receiveTimeout: const Duration(seconds: 6),
      ));

      final response = await dio.get(
        updateCheckUrl,
        queryParameters: {'t': DateTime.now().millisecondsSinceEpoch.toString()},
      );

      if (response.statusCode == 200) {
        dynamic data = response.data;
        if (data is String) {
          data = jsonDecode(data);
        }

        final int serverBuild = data['build_number'] ?? 1;
        final String serverVersion = data['latest_version'] ?? '2.4.0';
        final String downloadUrl = data['download_url'] ?? 'https://web-pi-two-15.vercel.app/downloads/PulsOps-Member-v2.4.apk';
        final String title = data['title'] ?? 'تحديث جديد متاح للتحميل';
        final String releaseNotes = data['release_notes'] ?? 'يتضمن هذا التحديث مزايا وتحسينات جديدة لأداء التطبيق.';
        final bool forceUpdate = data['force_update'] ?? false;

        if (serverBuild > currentBuildNumber) {
          if (!context.mounted) return;
          _showUpdateDialog(
            context,
            serverVersion: serverVersion,
            downloadUrl: downloadUrl,
            title: title,
            releaseNotes: releaseNotes,
            forceUpdate: forceUpdate,
          );
        } else if (showNoUpdateToast) {
          if (!context.mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: Color(0xFF1E293B),
              content: Text(
                'تطبيقك محدث إلى آخر إصدار متاح (v$currentVersion)',
                style: TextStyle(fontFamily: 'Cairo', color: Color(0xFF00FF66)),
                textAlign: TextAlign.right,
              ),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error checking update: $e');
    }
  }

  static void _showUpdateDialog(
    BuildContext context, {
    required String serverVersion,
    required String downloadUrl,
    required String title,
    required String releaseNotes,
    required bool forceUpdate,
  }) {
    showDialog(
      context: context,
      barrierDismissible: !forceUpdate,
      builder: (dialogContext) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: AlertDialog(
            backgroundColor: const Color(0xFF111111),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: Color(0xFF00FF66), width: 1.5),
            ),
            titlePadding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
            contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            actionsPadding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00FF66).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.system_update_rounded, color: Color(0xFF00FF66), size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontFamily: 'Cairo',
                        ),
                      ),
                      Text(
                        'الإصدار الجديد: v$serverVersion',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF00FF66),
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Cairo',
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A1A),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'أبرز التحديثات والمميزات الجديدة:',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          fontFamily: 'Cairo',
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        releaseNotes,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.75),
                          fontSize: 12,
                          height: 1.5,
                          fontFamily: 'Cairo',
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'يرجى تثبيت التحديث الآن للاستفادة من كافة الأنظمة واللوحات الجديدة.',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white54,
                    fontFamily: 'Cairo',
                  ),
                ),
              ],
            ),
            actions: [
              if (!forceUpdate)
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: const Text(
                    'تذكيري لاحقاً',
                    style: TextStyle(color: Colors.white60, fontFamily: 'Cairo'),
                  ),
                ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00FF66),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 6,
                ),
                onPressed: () async {
                  final uri = Uri.parse(downloadUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  }
                  if (dialogContext.mounted) {
                    Navigator.pop(dialogContext);
                  }
                },
                icon: const Icon(Icons.download_rounded, size: 20),
                label: const Text(
                  'تحميل التحديث فوراً',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Cairo'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
