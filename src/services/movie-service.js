export default class MovieService {
  _apiBase = new URL('https://api.themoviedb.org/3/');
  _apiKey = 'c8cff64abc6f2b2686c9404a9af3f27a';

  async getResource(url) {
    const res = await fetch(`${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
    }
    return await res.json();
  }

  async getGuestID() {
    let idURL = new URL('authentication/guest_session/new', this._apiBase);
    idURL.searchParams.set('api_key', this._apiKey);
    return await this.getResource(idURL);
  }

  async getMoviesBySearch(query, page) {
    let searchURL = new URL('search/movie', this._apiBase);
    let searchParams = new URLSearchParams([
      ['query', query],
      ['api_key', this._apiKey],
      ['page', page],
    ]);
    return await this.getResource(new URL(`${searchURL}?${searchParams.toString()}`));
  }

  async getRatedMovies(query, page) {
    let ratedURL = new URL(`guest_session/${query}/rated/movies`, this._apiBase);
    let searchParams = new URLSearchParams([
      ['api_key', this._apiKey],
      ['page', page],
    ]);
    return await this.getResource(new URL(`${ratedURL}?${searchParams.toString()}`));
  }

  async getGenre() {
    let genreURL = new URL('genre/movie/list', this._apiBase);
    genreURL.searchParams.set('api_key', this._apiKey);
    return await this.getResource(genreURL);
  }

  async postRating(guestId, movieId, rating) {
    let ratedPostID = new URL(`movie/${movieId}/rating`, this._apiBase);
    let searchParams = new URLSearchParams([
      ['api_key', this._apiKey],
      ['guest_session_id', guestId],
    ]);
    return await fetch(new URL(`${ratedPostID}?${searchParams.toString()}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    });
  }
}
