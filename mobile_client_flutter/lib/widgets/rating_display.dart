import 'package:flutter/material.dart';
import 'package:smooth_star_rating/smooth_star_rating.dart';

class RatingDisplay extends StatelessWidget {
  final double rating;
  final double size;

  const RatingDisplay({
    Key key,
    @required this.rating,
    this.size = 20.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SmoothStarRating(
      rating: rating,
      allowHalfRating: true,
      isReadOnly: true,
      starCount: 5,
      size: size,
      color: Theme.of(context).accentColor,
      borderColor: Theme.of(context).accentColor,
    );
  }
}
