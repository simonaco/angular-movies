import { environment } from '../../../environments/environment';
import { TMDBPaginatedResult, TMDBPaginationOptions } from '../api/model/pagination.interface';
import { PaginatedResult } from '../../shared/state/typings';

export const baseUrlApiV3 = [environment.tmdbBaseUrl, environment.apiV3].join('/');
export const baseUrlApiV4 = [environment.tmdbBaseUrl, environment.apiV4].join('/');

export function serverToClientPaginatedResult<T>(serverResult: TMDBPaginatedResult<T>) {
  const { total_pages: totalPages, total_results: totalResults, ...clientPart } = serverResult;
  const clientResult: PaginatedResult<T> = { ...clientPart, totalPages, totalResults };
  return clientResult;
}

export function getTMDBPaginationOptions(options: TMDBPaginationOptions = {} as TMDBPaginationOptions): TMDBPaginationOptions {
  let { page, sort_by } = options;
  page = page || 1;
  sort_by = sort_by || 'popularity.desc';
  return { sort_by, page };
}
