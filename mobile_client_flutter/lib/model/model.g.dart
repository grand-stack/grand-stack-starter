// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Neo4jDate _$Neo4jDateFromJson(Map<String, dynamic> json) {
  return Neo4jDate(
    year: json['year'] as int,
    month: json['month'] as int,
    day: json['day'] as int,
    formatted: json['formatted'] as String,
  );
}

Map<String, dynamic> _$Neo4jDateToJson(Neo4jDate instance) => <String, dynamic>{
      'year': instance.year,
      'month': instance.month,
      'day': instance.day,
      'formatted': instance.formatted,
    };

Neo4jPoint _$Neo4jPointFromJson(Map<String, dynamic> json) {
  return Neo4jPoint(
    latitude: (json['latitude'] as num)?.toDouble(),
    longitude: (json['longitude'] as num)?.toDouble(),
  );
}

Map<String, dynamic> _$Neo4jPointToJson(Neo4jPoint instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

User _$UserFromJson(Map<String, dynamic> json) {
  return User(
    userId: json['userId'] as String,
    name: json['name'] as String,
    reviews: (json['reviews'] as List)
        ?.map((e) =>
            e == null ? null : Review.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    avgStars: (json['avgStars'] as num)?.toDouble(),
    numReviews: json['numReviews'] as int,
    recommendations: (json['recommendations'] as List)
        ?.map((e) =>
            e == null ? null : Business.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'userId': instance.userId,
      'name': instance.name,
      'reviews': instance.reviews,
      'avgStars': instance.avgStars,
      'numReviews': instance.numReviews,
      'recommendations': instance.recommendations,
    };

Business _$BusinessFromJson(Map<String, dynamic> json) {
  return Business(
    businessId: json['businessId'] as String,
    name: json['name'] as String,
    address: json['address'] as String,
    city: json['city'] as String,
    state: json['state'] as String,
    location: json['location'] == null
        ? null
        : Neo4jPoint.fromJson(json['location'] as Map<String, dynamic>),
    avgStars: (json['avgStars'] as num)?.toDouble(),
    reviews: (json['reviews'] as List)
        ?.map((e) =>
            e == null ? null : Review.fromJson(e as Map<String, dynamic>))
        ?.toList(),
    categories: (json['categories'] as List)
        ?.map((e) =>
            e == null ? null : Category.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$BusinessToJson(Business instance) => <String, dynamic>{
      'businessId': instance.businessId,
      'name': instance.name,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'location': instance.location,
      'avgStars': instance.avgStars,
      'reviews': instance.reviews,
      'categories': instance.categories,
    };

Review _$ReviewFromJson(Map<String, dynamic> json) {
  return Review(
    reviewId: json['reviewId'] as String,
    stars: (json['stars'] as num)?.toDouble(),
    text: json['text'] as String,
    date: json['date'] == null
        ? null
        : Neo4jDate.fromJson(json['date'] as Map<String, dynamic>),
    business: json['business'] == null
        ? null
        : Business.fromJson(json['business'] as Map<String, dynamic>),
    user: json['user'] == null
        ? null
        : User.fromJson(json['user'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$ReviewToJson(Review instance) => <String, dynamic>{
      'reviewId': instance.reviewId,
      'stars': instance.stars,
      'text': instance.text,
      'date': instance.date,
      'business': instance.business,
      'user': instance.user,
    };

Category _$CategoryFromJson(Map<String, dynamic> json) {
  return Category(
    name: json['name'] as String,
    businesses: (json['businesses'] as List)
        ?.map((e) =>
            e == null ? null : Business.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$CategoryToJson(Category instance) => <String, dynamic>{
      'name': instance.name,
      'businesses': instance.businesses,
    };

RatingCount _$RatingCountFromJson(Map<String, dynamic> json) {
  return RatingCount(
    stars: (json['stars'] as num)?.toDouble(),
    count: json['count'] as int,
  );
}

Map<String, dynamic> _$RatingCountToJson(RatingCount instance) =>
    <String, dynamic>{
      'stars': instance.stars,
      'count': instance.count,
    };
