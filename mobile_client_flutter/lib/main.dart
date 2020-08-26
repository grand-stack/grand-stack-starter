import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:client_flutter/services/gql.dart';
import 'package:client_flutter/screens/business_list_screen.dart';
import 'package:client_flutter/screens/user_list_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GraphQLProvider(
      client: client,
      child: MaterialApp(
        title: 'GrandStack Flutter',
        theme: ThemeData(
          primarySwatch: Colors.indigo,
          accentColor: Colors.pinkAccent,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => BusinessListScreen(),
          '/users': (context) => UserListScreen(),
        },
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
