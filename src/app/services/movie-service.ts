import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { map, Observable, pipe, refCount, shareReplay } from "rxjs";
import { Movie } from "../interfaces/movie";
import { MovieResponse } from "../interfaces/movie-response";

@Injectable({
    providedIn: 'root'
})

export class MovieService {

    private readonly http=inject(HttpClient);
    private readonly url=environment.url_api;
    private readonly key= environment.api_key;
    private readonly movieUrl=environment.url_movie_api

    //public movieList:Movie[]=[]
    public movieList= signal<Movie[]>([]);
    public selectedMovie= signal<Movie|null>(null)
    public wishList= signal<Movie[]>(this.loadWishList());

    private loadWishList(): Movie[] {
        const savedWishList = localStorage.getItem('wishList');
        if (!savedWishList) {
            return [];
        }

        try {
            const parsed = JSON.parse(savedWishList) as Movie[];
            const uniqueMovies = parsed.filter(
                (movie, index, movies) =>
                    movies.findIndex(savedMovie => savedMovie.id === movie.id) === index
            );

            localStorage.setItem('wishList', JSON.stringify(uniqueMovies));
            return uniqueMovies;
        } catch {
            localStorage.removeItem('wishList');
            return [];
        }
    }

    getMovieList():Observable<Movie[]>{
        return this.http
             .get<MovieResponse>(`${this.url}?api_key=${this.key}`)
             .pipe(
                map(response=>response.results),
                shareReplay({bufferSize:1, refCount:false})

        );

    }

    getMovieById(id: number){
        return this.http.get<Movie>(`${this.movieUrl}/${id}?api_key=${this.key}`).pipe(
            map(response=>response)
        )
    }

    addToWishList(movie:Movie){
        if (this.wishList().some(savedMovie => savedMovie.id === movie.id)) {
            return;
        }

        this.wishList.update(wishList => [...wishList, movie]);
        localStorage.setItem('wishList', JSON.stringify(this.wishList()));
    }

    removeFromWishList(movie: Movie): void {
        this.wishList.update(wishList => wishList.filter(savedMovie => savedMovie.id !== movie.id));
        localStorage.setItem('wishList', JSON.stringify(this.wishList()));
    }
}
