import React from 'react';
import './app-page.css';
import { Pagination, Tabs, Alert, Space } from 'antd';
import { debounce } from 'lodash';

import MovieList from '../movie-list';
import MovieSearchForm from '../movie-search-form';
import MovieService from '../../services';
import { Provider } from '../movie-genre-context';

class AppPage extends React.Component {
  movieService = new MovieService();

  state = {
    guestID: '',
    query: 'return',
    page: 1,
    results: 20,
    selectedTab: '1',
    genres: '',
    errorID: false,
    errorGenres: false,
  };

  componentDidMount() {
    if (!sessionStorage.getItem('GuestID')) {
      this.movieService
        .getGuestID()
        .then((res) => {
          this.setState({
            guestID: res.guest_session_id,
            errorID: false,
          });
          sessionStorage.setItem('GuestID', res.guest_session_id);
        })
        //Изначально были попытки реализации через ComponentDidCatch, но он не обрабатывает серверные ошибки, а только рендера, поэтому реализовано через catch
        .catch(() => {
          this.setState({
            errorID: true,
          });
        });
    } else {
      this.setState({
        guestID: sessionStorage.getItem('GuestID'),
      });
    }
    this.movieService
      .getGenre()
      .then((res) => {
        this.setState({
          genres: Object.fromEntries(
            res.genres.map((item) => {
              return [item.id, item.name];
            })
          ),
          errorGenres: false,
        });
      })
      .catch(() => {
        this.setState({
          errorGenres: true,
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
    const { query, page, results, guestID, selectedTab, errorID, errorGenres } = this.state;
    const errorIDGet = errorID ? (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Something went wrong"
          description="We cannot create working session for you. It looks like there's some error in our website. We alredy trying to fix this."
          type="error"
        />
      </Space>
    ) : null;
    const errorGenresGet = errorGenres ? (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Something went wrong"
          description="We cannot get genres list for films. It's a little mistake and you still use rest site functional. And we trying to fix this."
          type="error"
        />
      </Space>
    ) : null;
    const search = selectedTab == '1' ? <MovieSearchForm getQuery={this.getQuery} query={query} /> : null;
    return (
      <div className="container">
        <Provider value={this.state.genres}>
          <React.Fragment>
            {errorIDGet}
            {errorGenresGet}
            <div className="tab-wrapper">
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
            </div>
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
      </div>
    );
  }
}

export default AppPage;
