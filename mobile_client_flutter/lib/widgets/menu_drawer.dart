import 'package:flutter/material.dart';

class MenuDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      // Add a ListView to the drawer. This ensures the user can scroll
      // through the options in the drawer if there isn't enough vertical
      // space to fit everything.
      child: ListView(
        // Important: Remove any padding from the ListView.
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            child: Column(
              children: [
                Container(
                  height: 80.0,
                  child: Image(
                    image: AssetImage('assets/images/grandstack.png'),
                  ),
                ),
                Text(
                  'GRANDstack Flutter',
                  style: Theme.of(context).textTheme.headline6.copyWith(
                        color: Colors.white,
                      ),
                ),
              ],
            ),
            decoration: BoxDecoration(
              color: Colors.indigo[800],
            ),
          ),
          ListTile(
            leading: Icon(Icons.business),
            title: Text('Businesses'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/');
            },
          ),
          ListTile(
            leading: Icon(Icons.group),
            title: Text('Users'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/users');
            },
          ),
        ],
      ),
    );
  }
}
