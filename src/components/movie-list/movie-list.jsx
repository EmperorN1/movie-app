import React from 'react';
import PropTypes from 'prop-types';
import './movie-list.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Alert, Space } from 'antd';

import MovieService from '../../services';
import MovieListItem from '../movie-list-item';

export default class MovieList extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    page: PropTypes.number.isRequired,
    guestID: PropTypes.string.isRequired,
    selectedTab: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onSetResults: () => {
      throw new Error('There is an Error in getting movie list');
    },
  };

  movieService = new MovieService();

  state = {
    lists: [],
    loading: true,
    error: false,
    // totalResults: 40,
  };

  constructor() {
    super();
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

  componentDidMount() {
    this.getListBySearch(this.props.guestID, this.props.selectedTab, this.props.query, this.props.page);
    this.props.onSetResults(this.state.totalResults);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.query !== prevProps.query ||
      this.props.page !== prevProps.page ||
      this.props.selectedTab !== prevProps.selectedTab ||
      this.state.totalResults !== prevState.totalResults
    ) {
      this.setState({
        loading: true,
        error: false,
      });
      this.getListBySearch(this.props.guestID, this.props.selectedTab, this.props.query, this.props.page);
      this.props.onSetResults(this.state.totalResults);
    }
  }

  getListBySearch(guestID, selectedTab, querry, page) {
    if (selectedTab == '1') {
      this.movieService.getMoviesBySearch(querry, page).then(this.onListLoaded).catch(this.onError);
    } else if (selectedTab == '2') {
      this.movieService.getRatedMovies(guestID, page).then(this.onListLoaded).catch(this.onError);
    }
  }

  onListLoaded = (arr) => {
    this.setState({
      lists: arr.results.map((item) => {
        return this._transformMovie(item);
      }),
      totalResults: arr.totalResults,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  createRenderList = (lists) => {
    return lists.map((item) => {
      return (
        <li key={item.id}>
          <MovieListItem {...item} guestID={this.props.guestID} />
        </li>
      );
    });
  };

  render() {
    const { lists, loading, error } = this.state;
    const hasData = !(loading || error);
    const result = this.createRenderList(lists);
    const antIcon = <LoadingOutlined style={{ fontSize: 200 }} spin />;

    const errorMessage = error ? (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Something went wrong"
          description="It seems that the servers we work with cannot provide the information you need. We are already dealing with this issue. Thanks for understanding."
          type="error"
        />
      </Space>
    ) : null;
    const empty =
      lists.length == 0 && hasData ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert message="Sorry" description="We couldn't find movie. Try something different." type="error" />
        </Space>
      ) : null;
    const spinner = loading ? <Spin indicator={antIcon} className="spin" /> : null;
    const content = hasData ? <ul className="movie-list">{result}</ul> : null;

    return (
      <div>
        {errorMessage}
        {spinner}
        {content}
        {empty}
      </div>
    );
  }
}
