import React from 'react';
import './app.css';
import { Alert, Space, Pagination, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';

import MovieList from '../movie-list/movie-list';
import MovieSearchForm from '../movie-search-form/movie-search-form';
import MovieService from '../../services/movie-service.jsx';
import { Provider } from '../movie-genre-context/movie-genre-context.jsx';

class App extends React.Component {
  movieService = new MovieService();
  genres;

  state = {
    guestID: '',
    query: 'return',
    page: 1,
    results: 20,
    selectedTab: '1',
  };

  componentDidMount() {
    this.movieService.getGenre().then((val) => {
      this.genres = val;
    });
    this.movieService.getGuestID().then((id) => {
      this.setState({
        guestID: id,
      });
    });
  }

  getQuery = debounce((value) => {
    this.setState({
      query: value,
    });
  }, 1000);

  onChangePage = (page) => {
    this.setState({
      page: page,
    });
  };

  onSetResults = (results) => {
    this.setState({
      results: results,
    });
  };

  onChangeTab = (key) => {
    this.setState({
      selectedTab: key,
    });
  };

  render() {
    const { query, page, results, guestID, selectedTab } = this.state;
    const search = selectedTab == '1' ? <MovieSearchForm getQuery={this.getQuery} query={query} /> : null;
    return (
      <div className="container">
        <Online>
          <Provider value={this.genres}>
            <React.Fragment>
              <Tabs
                centered
                defaultActiveKey={selectedTab}
                items={[
                  {
                    key: '1',
                    label: 'Search',
                  },
                  {
                    key: '2',
                    label: 'Rated',
                  },
                ]}
                onChange={this.onChangeTab}
              />
              {search}
              <MovieList
                query={query}
                page={page}
                guestID={guestID}
                selectedTab={selectedTab}
                onSetResults={this.onSetResults}
              />
              <Pagination
                onChange={(page) => this.onChangePage(page)}
                defaultCurrent={1}
                total={results}
                showSizeChanger={false}
                pageSize={20}
                className="paginator"
              />
            </React.Fragment>
          </Provider>
        </Online>
        <Offline>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="It looks like you reached the end of internet"
              description="It mignt be something good but unfortunately you connot watch content on our site."
              type="error"
            />
          </Space>
        </Offline>
      </div>
    );
  }
}

export default App;
