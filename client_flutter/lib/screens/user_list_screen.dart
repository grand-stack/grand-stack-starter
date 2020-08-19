import 'package:client_flutter/widgets/alert_box.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:client_flutter/model/model.dart';
import 'package:client_flutter/widgets/menu_drawer.dart';
import 'user_detail_screen.dart';

final getUsersQuery = gql("""
  query {
    User {
      userId,
      name,
      numReviews
    }
  }
""");

class UserListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Users'),
      ),
      drawer: MenuDrawer(),
      body: Query(
        options: QueryOptions(
          documentNode: getUsersQuery,
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

          final List<User> users = result.data['User']
              .map<User>((user) => User.fromJson(user))
              .toList();

          if (users.length == 0) {
            return AlertBox(
              type: AlertType.info,
              text: 'No users to show.',
              onRetry: refetch,
            );
          }

          return RefreshIndicator(
            onRefresh: () => refetch(),
            child: Material(
              child: ListView.builder(
                itemBuilder: (_, index) {
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Theme.of(context).primaryColorLight,
                      child: Text(
                        users[index].name.substring(0, 1),
                        style: TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ),
                    title: Text(users[index].name),
                    trailing: Text('${users[index].numReviews} reviews'),
                    onTap: () {
                      final userId = users[index].userId;
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              UserDetailScreen(userId: userId),
                        ),
                      );
                    },
                  );
                },
                itemCount: users.length,
              ),
            ),
          );
        },
      ),
    );
  }
}
