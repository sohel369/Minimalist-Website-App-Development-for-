import 'package:cloud_firestore/cloud_firestore.dart';

class RequestModel {
  final String id;
  final String userId;
  final String serviceId;
  final String serviceName;
  final DateTime date;
  final String timeSlot;
  final String address;
  final String addressType;
  final String description;
  final String status;
  final DateTime createdAt;

  RequestModel({
    required this.id,
    required this.userId,
    required this.serviceId,
    required this.serviceName,
    required this.date,
    required this.timeSlot,
    required this.address,
    required this.addressType,
    required this.description,
    required this.status,
    required this.createdAt,
  });

  factory RequestModel.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return RequestModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      serviceId: data['serviceId'] ?? '',
      serviceName: data['serviceName'] ?? '',
      date: (data['date'] as Timestamp).toDate(),
      timeSlot: data['timeSlot'] ?? '',
      address: data['address'] ?? '',
      addressType: data['addressType'] ?? '',
      description: data['description'] ?? '',
      status: data['status'] ?? 'pending',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'serviceId': serviceId,
      'serviceName': serviceName,
      'date': Timestamp.fromDate(date),
      'timeSlot': timeSlot,
      'address': address,
      'addressType': addressType,
      'description': description,
      'status': status,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
