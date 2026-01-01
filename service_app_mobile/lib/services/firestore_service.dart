import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/request_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Collection reference
  CollectionReference get _requestsRef => _db.collection('requests');

  // Create a new service request
  Future<String> createRequest(RequestModel request) async {
    try {
      DocumentReference docRef = await _requestsRef.add(request.toMap());
      return docRef.id;
    } catch (e) {
      print('Error creating request: $e');
      rethrow;
    }
  }

  // Get requests for a specific user
  Stream<List<RequestModel>> getUserRequests(String userId) {
    return _requestsRef
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => RequestModel.fromFirestore(doc))
          .toList();
    });
  }

  // Get recent requests (limited to 3) for dashboard
  Stream<List<RequestModel>> getRecentRequests(String userId) {
    return _requestsRef
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .limit(3)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => RequestModel.fromFirestore(doc))
          .toList();
    });
  }

  // Get a single request by ID
  Future<RequestModel?> getRequestById(String id) async {
    try {
      DocumentSnapshot doc = await _requestsRef.doc(id).get();
      if (doc.exists) {
        return RequestModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      print('Error getting request: $e');
      return null;
    }
  }
}
