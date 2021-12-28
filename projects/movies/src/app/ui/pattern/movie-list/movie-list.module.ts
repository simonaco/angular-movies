import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../star-rating/star-rating.module';
import { LetModule } from '@rx-angular/template/let';
import { RxForModule } from '../../../shared/rxa-custom/rx-for/rx-for.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StarRatingModule,
    LetModule,
    RxForModule
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
