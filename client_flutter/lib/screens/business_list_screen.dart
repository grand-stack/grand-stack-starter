import 'package:client_flutter/widgets/alert_box.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:client_flutter/model/model.dart';
import 'package:client_flutter/widgets/business_list_tile.dart';
import 'package:client_flutter/widgets/menu_drawer.dart';

final getBusinessesQuery = gql("""
  query {
    Business {
      businessId,
      name,
      city,
      state,
      avgStars
    }
  }
""");

class BusinessListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Businesses'),
      ),
      drawer: MenuDrawer(),
      body: Query(
        options: QueryOptions(
          documentNode: getBusinessesQuery,
        ),
        builder: (
          QueryResult result, {
          Future<QueryResult> Function() refetch,
          FetchMore fetchMore,
        }) {
          if (result.hasException) {
            return AlertBox(
              type: AlertType.error,
              text: result.exception.toString(),
              onRetry: () => refetch(),
            );
          }

          if (result.loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          final businesses = result.data['Business']
              .map((biz) => Business.fromJson(biz))
              .toList();

          if (businesses.length == 0) {
            return AlertBox(
              type: AlertType.info,
              text: 'No businesses to show.',
              onRetry: refetch,
            );
          }

          return RefreshIndicator(
            onRefresh: () => refetch(),
            child: Material(
              child: ListView.builder(
                itemBuilder: (_, index) {
                  return BusinessListTile(business: businesses[index]);
                },
                itemCount: businesses.length,
              ),
            ),
          );
        },
      ),
    );
  }
}
