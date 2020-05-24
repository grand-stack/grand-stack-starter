import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Query, User } from '../types';
import { getQueryParams, getTotal, getErrorMessage } from '../utils/query-helpers';

const GET_USERS = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_UserOrdering]
    $filter: _UserFilter
  ) {
    User(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      avgStars
      numReviews
    }
  }
`;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  error = '';
  loading = false;
  pageSize: number;
  users: Observable<User[]>;
  total = 0;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.loading = true;
  }

  refresh(state: ClrDatagridStateInterface) {
    this.error = '';
    this.loading = true;
    const { first, offset, filter, orderBy } = getQueryParams(state);
    this.users = this.apollo.watchQuery<Query>({
      query: GET_USERS,
      variables: {
        first, offset, filter, orderBy
      }
    })
      .valueChanges
      .pipe(
        map(result => result.data.User),
        tap(list => {
          this.loading = false;
          this.total = getTotal(offset, first, list.length);
        }),
        catchError(err => {
          this.loading = false;
          this.error = getErrorMessage(err);
          return of([]);
        })
      );
  }

}
