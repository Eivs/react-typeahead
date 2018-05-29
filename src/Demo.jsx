import React, { Component } from 'react';
import { Typeahead } from './Typeahead';

import fuzzy from './Typeahead/utils/fuzzy';
import { results as data } from './data.json';

const { Fragment } = React;

class Demo extends Component {
  searchOptions = (value, options) => {
    const res = fuzzy.filter(value, options, {
      pre: '<span>',
      post: '</span>',
      extract: n => `${n.name.first} ${n.name.last}`,
    });
    const matches = res.map(item => item.string);
    return matches;
  };

  displayOption = option => option;

  render() {
    return (
      <Fragment>
        <h1>Demo</h1>
        <Typeahead
          maxVisible={10}
          displayOption={this.displayOption}
          searchOptions={this.searchOptions}
          options={data}
        />
      </Fragment>
    );
  }
}

export default Demo;
