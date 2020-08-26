import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:client_flutter/model/model.dart';
import 'package:client_flutter/screens/user_detail_screen.dart';
import 'package:client_flutter/widgets/alert_box.dart';
import 'package:client_flutter/widgets/rating_display.dart';

final businessByIdQuery = gql("""
  query businessById(\$id: ID) {
    Business(businessId: \$id) {
      businessId,
      name,
      address,
      city,
      state,
      avgStars,
      categories {
        name
      }
      reviews {
        stars,
        text,
        date {
          year
          month
          day
        },
        user {
          userId
          name
        }
      }
    }
  }
""");

class BusinessDetailScreen extends StatelessWidget {
  final String businessId;

  const BusinessDetailScreen({Key key, @required this.businessId})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Query(
      options: QueryOptions(
        documentNode: businessByIdQuery,
        variables: {
          'id': businessId,
        },
      ),
      builder: (
        QueryResult result, {
        Future<QueryResult> Function() refetch,
        FetchMore fetchMore,
      }) {
        Widget body;
        String name = '';

        if (result.hasException) {
          body = AlertBox(
            type: AlertType.error,
            text: result.exception.toString(),
            onRetry: () => refetch(),
          );
        } else if (result.loading) {
          body = const Center(
            child: CircularProgressIndicator(),
          );
        } else {
          final business = Business.fromJson(result.data['Business'][0]);
          name = business.name;

          body = SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                BusinessCard(business: business),
                Container(
                  alignment: Alignment.center,
                  padding: EdgeInsets.symmetric(
                    horizontal: 16.0,
                    vertical: 8.0,
                  ),
                  child: Text(
                    'Reviews',
                    style: Theme.of(context).textTheme.headline6,
                  ),
                ),
                ...ListTile.divideTiles(
                  context: context,
                  tiles: business.reviews
                      .map((review) => ReviewTile(review: review))
                      .toList(),
                ),
              ],
            ),
          );
        }
        return Scaffold(
          appBar: AppBar(
            title: Text(name),
          ),
          body: body,
        );
      },
    );
  }
}

class BusinessCard extends StatelessWidget {
  const BusinessCard({
    Key key,
    @required this.business,
  }) : super(key: key);

  final Business business;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Align(
            alignment: Alignment.center,
            child: RatingDisplay(
              rating: business.avgStars,
              size: 32.0,
            ),
          ),
          SizedBox(height: 12.0),
          Text(
            business.address,
            style: TextStyle(fontSize: 16.0),
          ),
          Text(
            '${business.city}, ${business.state}',
            style: TextStyle(fontSize: 18.0),
          ),
          SizedBox(height: 12.0),
          Wrap(
            spacing: 8.0,
            children: business.categories
                .map((cat) => Chip(label: Text(cat.name)))
                .toList(),
          ),
        ],
      ),
    );
  }
}

class ReviewTile extends StatelessWidget {
  final Review review;

  const ReviewTile({
    Key key,
    @required this.review,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: () {
          final userId = review.user.userId;
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => UserDetailScreen(userId: userId),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 16.0,
            vertical: 12.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  RatingDisplay(
                    rating: review.stars,
                    size: 18.0,
                  ),
                  Text(
                    '${review.date.month}/${review.date.day}/${review.date.year}',
                    style: TextStyle(color: Colors.black54),
                  ),
                ],
              ),
              SizedBox(height: 4.0),
              review.text != ''
                  ? Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        review.text,
                        style: TextStyle(color: Colors.black87),
                      ),
                    )
                  : SizedBox.shrink(),
              review.text != '' ? SizedBox(height: 8.0) : SizedBox.shrink(),
              Text(
                '- ${review.user.name}',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
