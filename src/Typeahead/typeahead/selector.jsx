import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TypeaheadOption from './option';

class TypeaheadSelector extends Component {
  static propTypes = {
    options: PropTypes.array,
    allowCustomValues: PropTypes.number,
    customClasses: PropTypes.object,
    customValue: PropTypes.string,
    selectionIndex: PropTypes.number,
    onOptionSelected: PropTypes.func,
    displayOption: PropTypes.func.isRequired,
    defaultClassNames: PropTypes.bool,
    areResultsTruncated: PropTypes.bool,
    resultsTruncatedMessage: PropTypes.string,
  };

  static defaultProps = {
    selectionIndex: null,
    customClasses: {},
    allowCustomValues: 0,
    customValue: null,
    onOptionSelected: () => {},
    defaultClassNames: true,
  };

  handleOnClick = (result, event) => {
    const { onOptionSelected } = this.props;
    onOptionSelected(result, event);
  };

  render() {
    const {
      customValue,
      selectionIndex,
      options,
      displayOption,
      allowCustomValues,
      defaultClassNames,
      customClasses,
      areResultsTruncated,
      resultsTruncatedMessage,
    } = this.props;

    if (!options.length && allowCustomValues <= 0) {
      return null;
    }

    let customItem = null;
    let customValueOffset = 0;
    if (customValue !== null) {
      customValueOffset += 1;
      customItem = (
        <TypeaheadOption
          key={customValue}
          hover={selectionIndex === 0}
          customClasses={customClasses}
          customValue={customValue}
          onClick={event => {
            this.handleOnClick(customValue, event);
          }}
        >
          {customValue}
        </TypeaheadOption>
      );
    }

    const results = options.map((result, i) => {
      const displayString = displayOption(result, i);
      const uniqueKey = `${displayString}_${i}`;
      return (
        <TypeaheadOption
          key={uniqueKey}
          hover={selectionIndex === i + customValueOffset}
          customClasses={customClasses}
          onClick={event => {
            this.handleOnClick(result, event);
          }}
        >
          {displayString}
        </TypeaheadOption>
      );
    }, this);

    if (areResultsTruncated && resultsTruncatedMessage !== null) {
      const truncated = (
        <li
          key="results-truncated"
          className={classNames(customClasses.resultsTruncated, {
            'results-truncated': defaultClassNames,
          })}
        >
          {resultsTruncatedMessage}
        </li>
      );

      results.push(truncated);
    }

    return (
      <ul
        className={classNames(customClasses.results, {
          'typeahead-selector': defaultClassNames,
        })}
      >
        {customItem}
        {results}
      </ul>
    );
  }
}

export default TypeaheadSelector;
