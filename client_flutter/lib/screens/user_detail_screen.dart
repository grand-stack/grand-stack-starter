import 'package:client_flutter/model/model.dart';
import 'package:client_flutter/widgets/alert_box.dart';
import 'package:client_flutter/widgets/business_list_tile.dart';
import 'package:client_flutter/widgets/rating_display.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'business_detail_screen.dart';

final userByIdQuery = gql("""
  query userById(\$id: ID) {
    User(userId: \$id) {
      userId,
      name,
      reviews {
        stars,
        text,
        date {
          year
          month
          day
        },
        business {
          businessId
          name
        }
      }
      recommendations {
        businessId
        name
        avgStars
        city
        state
      }
    }
  }
""");

class UserDetailScreen extends StatelessWidget {
  final String userId;

  const UserDetailScreen({Key key, @required this.userId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Query(
      options: QueryOptions(
        documentNode: userByIdQuery,
        variables: {
          'id': userId,
        },
      ),
      builder: (
        QueryResult result, {
        Future<QueryResult> Function() refetch,
        FetchMore fetchMore,
      }) {
        Widget body;
        String name = '';
        int numReviews = 0;
        int numReccomendations = 0;

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
          final user = User.fromJson(result.data['User'][0]);
          name = user.name;
          numReviews = user.reviews.length;
          numReccomendations = user.recommendations.length;

          body = TabBarView(
            children: [
              UserReviewsView(
                user: user,
              ),
              UserReccomendationsView(
                user: user,
              ),
            ],
          );
        }

        return DefaultTabController(
          length: 2,
          child: Scaffold(
            appBar: AppBar(
              title: Text(name),
              bottom: TabBar(
                tabs: [
                  Tab(
                    text: 'Reviews ($numReviews)',
                  ),
                  Tab(
                    text: 'Reccomendations ($numReccomendations)',
                  ),
                ],
              ),
            ),
            body: body,
          ),
        );
      },
    );
  }
}

class UserReviewsView extends StatelessWidget {
  final User user;

  const UserReviewsView({
    Key key,
    @required this.user,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (user.reviews.length == 0) {
      return Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('No reviews to show.'),
      );
    }
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(16.0),
            child: Text('Reviews by ${user.name}'),
          ),
          ...ListTile.divideTiles(
                  context: context,
                  tiles: user.reviews
                      .map<Widget>((review) => UserReview(review: review)))
              .toList(),
        ],
      ),
    );
  }
}

class UserReview extends StatelessWidget {
  final Review review;

  const UserReview({
    Key key,
    @required this.review,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: () {
          final businessId = review.business.businessId;
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  BusinessDetailScreen(businessId: businessId),
            ),
          );
        },
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 16.0,
            vertical: 12.0,
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    review.business.name,
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  RatingDisplay(
                    rating: review.stars,
                    size: 20.0,
                  ),
                ],
              ),
              review.text != '' ? SizedBox(height: 4.0) : SizedBox.shrink(),
              review.text != ''
                  ? Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        review.text,
                        style: TextStyle(color: Colors.black87),
                      ),
                    )
                  : SizedBox.shrink(),
            ],
          ),
        ),
      ),
    );
  }
}

class UserReccomendationsView extends StatelessWidget {
  final User user;

  const UserReccomendationsView({
    Key key,
    @required this.user,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (user.recommendations.length == 0) {
      return Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('No reccomendations to show.'),
      );
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(16.0),
            child: Text('Reccomendations for ${user.name}'),
          ),
          ...ListTile.divideTiles(
                  context: context,
                  tiles: user.recommendations
                      .map<Widget>((biz) => BusinessListTile(business: biz)))
              .toList(),
        ],
      ),
    );
  }
}
