import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [],
  selector: 'app-wish-list',
  styleUrl: './wish-list.css',
  templateUrl: './wish-list.html',
})
export class WishList {
  public movieService = inject(MovieService);
  private router = inject(Router);

  navigateTo(movie: Movie): void {
    this.router.navigate(['/', movie.id]);
  }

  backToMovieList(): void {
    this.router.navigate(['/']);
  }

  removeFromWishList(movie: Movie, event: MouseEvent): void {
    event.stopPropagation();
    this.movieService.removeFromWishList(movie);
  }
}
