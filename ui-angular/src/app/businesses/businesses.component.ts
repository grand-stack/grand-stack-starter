import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Query, Business } from '../types';
import { getQueryParams, getTotal, getErrorMessage } from '../utils/query-helpers';

const GET_BUSINESSES = gql`
  query businessesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_BusinessOrdering]
    $filter: _BusinessFilter
  ) {
    Business(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      address
      city
      state
      avgStars
    }
  }
`;

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styles: []
})
export class BusinessesComponent implements OnInit {

  businesses: Observable<Business[]>;
  error = '';
  loading = false;
  total = 0;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.loading = true;
  }

  refresh(state: ClrDatagridStateInterface) {
    this.error = '';
    this.loading = true;
    const { first, offset, filter, orderBy } = getQueryParams(state);
    this.businesses = this.apollo.watchQuery<Query>({
      query: GET_BUSINESSES,
      variables: {
        first, offset, filter, orderBy
      }
    })
      .valueChanges
      .pipe(
        map(result => result.data.Business),
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
