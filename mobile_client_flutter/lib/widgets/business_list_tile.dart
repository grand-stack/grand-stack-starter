import 'package:flutter/material.dart';
import 'package:client_flutter/model/model.dart';
import 'package:client_flutter/screens/business_detail_screen.dart';
import 'rating_display.dart';

class BusinessListTile extends StatelessWidget {
  const BusinessListTile({
    Key key,
    @required this.business,
  }) : super(key: key);

  final Business business;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(business.name),
      subtitle: Text(business.city + ', ' + business.state),
      trailing: RatingDisplay(
        rating: business.avgStars,
        size: 20.0,
      ),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                BusinessDetailScreen(businessId: business.businessId),
          ),
        );
      },
    );
  }
}
