import React from 'react';
import PropTypes from 'prop-types';
import './movie-search-form.css';

export default class MovieSearchForm extends React.Component {
  static propTypes = {
    query: PropTypes.string,
  };

  static defaultProps = {
    getQuery: () => {
      throw new Error('There is an Error in searching movie');
    },
  };

  state = {
    search: this.props.query,
  };

  onGetQuery = (e) => {
    this.setState({
      search: e.target.value,
    });
    if (e.target.value.trim()) {
      this.props.getQuery(e.target.value);
    }
  };

  render() {
    const { search } = this.state;
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="movie-form"
          onChange={this.onGetQuery}
          value={search}
          placeholder="Type to search..."
        />
      </form>
    );
  }
}
