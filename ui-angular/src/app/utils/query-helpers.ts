import { ClrDatagridStateInterface } from '@clr/angular';
import { ErrorResponse } from 'apollo-link-error';

export function getQueryParams(state: ClrDatagridStateInterface) {
  // Clarity DataGrid docs at https://v2.clarity.design/datagrid/server-driven
  const first = state.page.size;
  const offset = Math.max(0, state.page.from);
  const filter = getFilters(state);
  const orderBy = getSortOrder(state);
  return { first, offset, filter, orderBy };
}

export function getFilters(state: ClrDatagridStateInterface) {
  if (!state.filters) {
    return {};
  }
  const gqlFilter: any = {};
  state.filters.forEach(filter => {
    if (filter.property) {
      // string filter
      gqlFilter[filter.property + '_contains'] = filter.value;
    }
  });
  return gqlFilter;
}

export function getSortOrder(state: ClrDatagridStateInterface) {
  if (!state.sort) {
    return;
  }
  return state.sort.by + '_' + (state.sort.reverse ? 'desc' : 'asc');
}

export function getTotal(offset: number, pageSize: number, currentItems: number) {
  let total = offset + currentItems;
  // If the number of items evenly fill up a page, add 1 to enable the next page
  if (total > 0 && total % pageSize === 0) {
    total++;
  }
  return total;
}

export function getErrorMessage(err: ErrorResponse) {
  const { graphQLErrors, networkError } = err;
  let message = 'Unknown error';
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
    message = 'GraphQL errors occurred. Check the console for details.';
  }
  if (networkError) {
    console.warn(`[Network error]: ${networkError.message}`);
    message = networkError.message;
  }
  return message;
}
