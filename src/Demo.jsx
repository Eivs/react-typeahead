import React, { Component } from 'react';
import { Typeahead } from './Typeahead';

// import fuzzy from './Typeahead/utils/fuzzy';
import { results as data } from './data.json';

const { Fragment } = React;

class Demo extends Component {
  onOptionSelected = (result, event) => {
    console.log(result, event);
  };

  displayOption = option =>
    // if (value) {
    //   const result = fuzzy.match(value, option.email, { pre: '<em>', post: '</em>' });
    //   return result.rendered;
    // }
    option.email;

  formInputOption = option => {
    console.log(option);
    return option.email;
  };

  render() {
    return (
      <Fragment>
        <h1>Demo</h1>
        <Typeahead
          maxVisible={10}
          filterOption="login.username"
          displayOption="login.username"
          options={data}
          showOptionsWhenEmpty={false}
          onOptionSelected={this.onOptionSelected}
          resultsTruncatedMessage="resultsTruncatedMessage"
        />
      </Fragment>
    );
  }
}

export default Demo;
