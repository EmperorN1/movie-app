import React, { Component } from 'react';
import format from 'date-fns/format';
import { Rate } from 'antd';

import './movie-list-item.css';
import MovieService from '../../services/movie-service';
import { Consumer } from '../movie-genre-context/movie-genre-context';

export default class MovieListItem extends Component {
  movieService = new MovieService();

  rateMovie = (value) => {
    this.movieService.postRating(this.props.guestID, this.props.id, value).then((res) => {
      console.log(res);
    });
  };

  sliceWords = (string, length) => {
    if (string.length > length) {
      let res = string.slice(0, length).split(' ');
      return res.slice(0, res.length - 1).join(' ') + ' ...';
    } else return string;
  };
  render() {
    const { title, releaseDate, overview, posterPath, voteAverage, rating, genreIds } = this.props;

    let poster = 'https://image.tmdb.org/t/p/original';
    if (posterPath == null) {
      poster = 'https://i.pinimg.com/736x/33/bb/b2/33bbb266307fc377f570c9ebe8c306f1.jpg';
    } else {
      poster += posterPath;
    }

    let className = 'movie-card-vote';
    if (voteAverage < 3) {
      className += ' low';
    } else if (voteAverage >= 3 && voteAverage < 5) {
      className += ' middle';
    } else if (voteAverage >= 5 && voteAverage < 7) {
      className += ' high';
    } else className += ' very-high';

    return (
      <div className="movie-card">
        <img className="movie-card-img" src={poster} />
        <div className="movie-card-info">
          <span className="movie-card-title">{this.sliceWords(title, 50)}</span>
          <span className={className}>{voteAverage}</span>
          <ul>
            <li className="movie-card-date">
              <span>{releaseDate ? format(new Date(releaseDate), 'PPP') : null}</span>
            </li>
            <Consumer>
              {(genres) => {
                return (
                  <li className="movie-card-genre">
                    {genreIds.map((item) => {
                      return <span key={item}>{genres[item]}</span>;
                    })}
                  </li>
                );
              }}
            </Consumer>
            <li className="movie-card-overview">
              <span>{this.sliceWords(overview, 200)}</span>
            </li>
            <li className="movie-card-rate">
              <Rate className="rate" allowHalf defaultValue={rating} count={10} onChange={this.rateMovie} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
