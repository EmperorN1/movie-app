export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';
  _apiKey = 'c8cff64abc6f2b2686c9404a9af3f27a';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
    }
    return await res.json();
  }

  async getGuestID() {
    const res = await this.getResource(`authentication/guest_session/new?api_key=${this._apiKey}`);
    return res.guest_session_id;
  }

  async getMoviesBySearch(query, page) {
    const res = await this.getResource(`search/movie?query=${query}&api_key=${this._apiKey}&page=${page}`);
    return {
      results: res.results.map((item) => {
        return this._transformMovie(item);
      }),
      totalResults: res.total_results,
    };
  }

  async getRatedMovies(query, page) {
    const res = await this.getResource(`guest_session/${query}/rated/movies?api_key=${this._apiKey}&page=${page}`);
    // console.log(res);
    return {
      results: res.results.map((item) => {
        return this._transformMovie(item);
      }),
      totalResults: res.total_results,
    };
  }

  async getGenre() {
    const res = await this.getResource(`genre/movie/list?api_key=${this._apiKey}`);
    return Object.fromEntries(
      res.genres.map((item) => {
        return [item.id, item.name];
      })
    );
  }

  async postRating(guestId, movieId, rating) {
    return await fetch(`${this._apiBase}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    });
  }

  _transformMovie(obj) {
    return {
      genreIds: obj.genre_ids,
      id: obj.id,
      title: obj.title,
      overview: obj.overview,
      posterPath: obj.poster_path,
      releaseDate: obj.release_date,
      rating: obj.rating,
      voteAverage: obj.vote_average.toFixed(1),
    };
  }
}
