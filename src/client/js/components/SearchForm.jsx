import React from 'react';
import PropTypes from 'prop-types';
import { createSubscribedElement } from './UnstatedUtils';
import AppContainer from '../services/AppContainer';

import SearchTypeahead from './SearchTypeahead';

// SearchTypeahead wrapper
class SearchForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchError: null,
    };

    this.onSearchError = this.onSearchError.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onSearchError(err) {
    this.setState({
      searchError: err,
    });
  }

  onChange(selected) {
    const page = selected[0]; // should be single page selected

    // navigate to page
    if (page != null) {
      window.location = page.path;
    }
  }

  getHelpElement() {
    const { t, appContainer } = this.props;

    const config = appContainer.getConfig();
    const isReachable = config.isSearchServiceReachable;

    if (!isReachable) {
      return (
        <>
          <h5 className="text-danger">Error occured on Search Service</h5>
          Try to reconnect from management page.
        </>
      );
    }

    return (
      <table className="table m-1 search-help">
        <caption className="text-left text-primary p-2 mb-2">
          <h5 className="m-1"><i className="icon-magnifier pr-2 mb-2" />{ t('search_help.title') }</h5>
        </caption>
        <tbody>
          <tr>
            <th className="text-right pt-2">
              <code>word1</code> <code>word2</code><br></br>
              <small>({ t('search_help.and.syntax help') })</small>
            </th>
            <td><h6 className="m-0 pt-1">{ t('search_help.and.desc', { word1: 'word1', word2: 'word2' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2">
              <code>&quot;This is GROWI&quot;</code><br></br>
              <small>({ t('search_help.phrase.syntax help') })</small>
            </th>
            <td><h6 className="m-0 pt-1">{ t('search_help.phrase.desc', { phrase: 'This is GROWI' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2"><code>-keyword</code></th>
            <td><h6 className="m-0 pt-1">{ t('search_help.exclude.desc', { word: 'keyword' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2"><code>prefix:/user/</code></th>
            <td><h6 className="m-0 pt-1">{ t('search_help.prefix.desc', { path: '/user/' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2"><code>-prefix:/user/</code></th>
            <td><h6 className="m-0 pt-1">{ t('search_help.exclude_prefix.desc', { path: '/user/' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2"><code>tag:wiki</code></th>
            <td><h6 className="m-0 pt-1">{ t('search_help.tag.desc', { tag: 'wiki' }) }</h6></td>
          </tr>
          <tr>
            <th className="text-right pt-2"><code>-tag:wiki</code></th>
            <td><h6 className="m-0 pt-1">{ t('search_help.exclude_tag.desc', { tag: 'wiki' }) }</h6></td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const { t, appContainer } = this.props;

    const config = appContainer.getConfig();
    const isReachable = config.isSearchServiceReachable;

    const placeholder = isReachable
      ? 'Search ...'
      : 'Error on Search Service';
    const emptyLabel = (this.state.searchError !== null)
      ? 'Error on searching.'
      : t('search.search page bodies');

    return (
      <SearchTypeahead
        onChange={this.onChange}
        onSubmit={this.props.onSubmit}
        onInputChange={this.props.onInputChange}
        onSearchError={this.onSearchError}
        emptyLabel={emptyLabel}
        placeholder={placeholder}
        helpElement={this.getHelpElement()}
        keywordOnInit={this.props.keyword}
      />
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const SearchFormWrapper = (props) => {
  return createSubscribedElement(SearchForm, props, [AppContainer]);
};

SearchForm.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  keyword: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
};

SearchForm.defaultProps = {
  onInputChange: () => {},
};

export default SearchFormWrapper;
