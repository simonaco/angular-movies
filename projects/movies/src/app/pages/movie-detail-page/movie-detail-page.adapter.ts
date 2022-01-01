import { Injectable } from '@angular/core';
import { combineLatest, map, startWith, switchMap, switchMapTo } from 'rxjs';
import { RxState, selectSlice } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { MovieState } from '../../shared/state/movie.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { getCredits, getMoviesRecommendations } from '../../data-access/api/resources/movie.resource';
import { transformToMovieDetail } from './selection/client-movie-detail.mapper';
import { getActions } from '../../shared/rxa-custom/actions';
import { infiniteScrolled, InfiniteScrolleState } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { MovieDetail } from './selection/movie-detail.model';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';


export interface MovieDetailPageModel {
  loading: boolean;
  movie: MovieDetail;
  recommendations: Partial<InfiniteScrolleState<TMDBMovieModel>>;
  cast: TMDBMovieCastModel[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieDetailAdapter extends RxState<MovieDetailPageModel> {

  private readonly actions = getActions<{ paginate: void }>();
  readonly paginate = this.actions.paginate;
  routedMovieSlice$ = this.select(selectSlice(['movie', 'loading']));
  routerMovieId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('movie', 'detail')
  );

  movieRecommendationsById$ = infiniteScrolled(
    (params, identifier) => getMoviesRecommendations(identifier, params),
    this.actions.paginate$.pipe(switchMapTo(this.routerMovieId$))
  );

  movieCastById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(
    private movieState: MovieState,
    private routerState: RouterState) {
    super();
    this.connect(
      combineLatest({
        id: this.routerMovieId$,
        globalSlice: this.movieState.select(
          selectSlice(['movies', 'moviesLoading'])
        )
      }).pipe(
        map(({ id, globalSlice }) => {
          const { movies, moviesLoading: loading } = globalSlice;
          return {
            loading,
            movie:
              movies[id] !== undefined
                ? transformToMovieDetail(movies[id])
                : null
          } as MovieDetailPageModel;
        })
      )
    );
  }
}
