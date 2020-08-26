import 'package:json_annotation/json_annotation.dart';
part 'model.g.dart';

@JsonSerializable()
class Neo4jDate {
  int year;
  int month;
  int day;
  String formatted;

  Neo4jDate({this.year, this.month, this.day, this.formatted});

  factory Neo4jDate.fromJson(Map<String, dynamic> json) =>
      _$Neo4jDateFromJson(json);
  Map<String, dynamic> toJson() => _$Neo4jDateToJson(this);
}

@JsonSerializable()
class Neo4jPoint {
  double latitude;
  double longitude;

  Neo4jPoint({this.latitude, this.longitude});

  factory Neo4jPoint.fromJson(Map<String, dynamic> json) =>
      _$Neo4jPointFromJson(json);
  Map<String, dynamic> toJson() => _$Neo4jPointToJson(this);
}

@JsonSerializable()
class User {
  String userId;
  String name;
  List<Review> reviews;
  double avgStars;
  int numReviews;
  List<Business> recommendations;

  User(
      {this.userId,
      this.name,
      this.reviews,
      this.avgStars,
      this.numReviews,
      this.recommendations});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

@JsonSerializable()
class Business {
  String businessId;
  String name;
  String address;
  String city;
  String state;
  Neo4jPoint location;
  double avgStars;
  List<Review> reviews;
  List<Category> categories;

  Business(
      {this.businessId,
      this.name,
      this.address,
      this.city,
      this.state,
      this.location,
      this.avgStars,
      this.reviews,
      this.categories});

  factory Business.fromJson(Map<String, dynamic> json) =>
      _$BusinessFromJson(json);
  Map<String, dynamic> toJson() => _$BusinessToJson(this);
}

@JsonSerializable()
class Review {
  String reviewId;
  double stars;
  String text;
  Neo4jDate date;
  Business business;
  User user;

  Review({
    this.reviewId,
    this.stars,
    this.text,
    this.date,
    this.business,
    this.user,
  });

  factory Review.fromJson(Map<String, dynamic> json) => _$ReviewFromJson(json);
  Map<String, dynamic> toJson() => _$ReviewToJson(this);
}

@JsonSerializable()
class Category {
  String name;
  List<Business> businesses;

  Category({this.name, this.businesses});

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}

@JsonSerializable()
class RatingCount {
  double stars;
  int count;

  RatingCount({this.stars, this.count});

  factory RatingCount.fromJson(Map<String, dynamic> json) =>
      _$RatingCountFromJson(json);
  Map<String, dynamic> toJson() => _$RatingCountToJson(this);
}
