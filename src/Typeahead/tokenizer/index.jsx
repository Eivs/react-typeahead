import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Token from './token';
import Typeahead from '../typeahead';
import Accessor from '../utils/accessor';
import KeyEvent from '../utils/keyevent';

const arraysAreDifferent = (array1, array2) => {
  if (array1.length !== array2.length) {
    return true;
  }
  for (let i = array2.length - 1; i >= 0; i -= 1) {
    if (array2[i] !== array1[i]) {
      return true;
    }
  }
  return false;
};

const noop = () => {};
/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
class TypeaheadTokenizer extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array,
    customClasses: PropTypes.object,
    allowCustomValues: PropTypes.number,
    defaultSelected: PropTypes.array,
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    inputProps: PropTypes.object,
    onTokenRemove: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onTokenAdd: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchOptions: PropTypes.func,
    displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    formInputOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    maxVisible: PropTypes.number,
    resultsTruncatedMessage: PropTypes.string,
    defaultClassNames: PropTypes.bool,
    showOptionsWhenEmpty: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    defaultSelected: [],
    customClasses: {},
    allowCustomValues: 0,
    initialValue: '',
    placeholder: '',
    disabled: false,
    inputProps: {},
    defaultClassNames: true,
    filterOption: null,
    searchOptions: null,
    displayOption: token => token,
    formInputOption: null,
    onKeyDown: noop,
    onKeyPress: noop,
    onKeyUp: noop,
    onFocus: noop,
    onBlur: noop,
    onTokenAdd: noop,
    onTokenRemove: noop,
    showOptionsWhenEmpty: false,
  };

  state = {
    selected: this.props.defaultSelected.slice(0),
  };

  componentWillReceiveProps(nextProps) {
    // if we get new defaultProps, update selected
    if (arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)) {
      this.setState({ selected: nextProps.defaultSelected.slice(0) });
    }
  }

  onKeyDown = event => {
    const { onKeyDown } = this.props;
    // We only care about intercepting backspaces
    if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
      this.handleBackspace(event);
      return;
    }
    onKeyDown(event);
  };

  getSelectedTokens = () => this.state.selected;

  getOptionsForTypeahead = () => this.props.options;

  focus = () => {
    this.typeahead.focus();
  };

  handleBackspace = event => {
    const { selected } = this.state;
    // No tokens
    if (!selected.length) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    // TODO:
    debugger;
    console.log(this.typeahead);
    const { entry } = this.typeahead.refs;
    if (entry.selectionStart === entry.selectionEnd && entry.selectionStart === 0) {
      this.removeTokenForValue(selected[selected.length - 1]);
      event.preventDefault();
    }
  };

  removeTokenForValue = value => {
    const { selected } = this.state;
    const index = selected.indexOf(value);

    if (index === -1) {
      return;
    }

    selected.splice(index, 1);
    this.setState({ selected });
    this.props.onTokenRemove(value);
  };

  addTokenForValue = value => {
    const { selected } = this.state;

    if (selected.includes(value)) {
      return;
    }

    selected.push(value);
    this.setState({ selected });
    this.typeahead.setEntryText('');
    this.props.onTokenAdd(value);
  };

  // TODO: Support initialized tokens
  renderTokens = () => {
    const { customClasses, name, displayOption, formInputOption } = this.props;
    const { selected } = this.state;

    const result = selected.map(item => {
      const displayString = Accessor.valueForOption(displayOption, item);
      const value = Accessor.valueForOption(formInputOption || displayOption, item);
      return (
        <Token
          key={displayString}
          className={classNames(customClasses.token)}
          onRemove={this.removeTokenForValue}
          object={item}
          value={value}
          name={name}
        >
          {displayString}
        </Token>
      );
    }, this);

    return result;
  };

  render() {
    const {
      className,
      customClasses,
      defaultClassNames,
      options,
      placeholder,
      disabled,
      inputProps,
      allowCustomValues,
      initialValue,
      maxVisible,
      resultsTruncatedMessage,
      onKeyPress,
      onKeyUp,
      onFocus,
      onBlur,
      displayOption,
      filterOption,
      searchOptions,
      showOptionsWhenEmpty,
    } = this.props;

    const classList = classNames(customClasses.typeahead);
    const tokenizerClassList = classNames(className, { 'typeahead-tokenizer': defaultClassNames });

    return (
      <div className={tokenizerClassList}>
        {this.renderTokens()}
        <Typeahead
          ref={n => {
            this.typeahead = n;
          }}
          className={classList}
          placeholder={placeholder}
          disabled={disabled}
          inputProps={inputProps}
          allowCustomValues={allowCustomValues}
          customClasses={customClasses}
          options={options}
          initialValue={initialValue}
          maxVisible={maxVisible}
          resultsTruncatedMessage={resultsTruncatedMessage}
          onOptionSelected={this.addTokenForValue}
          onKeyDown={this.onKeyDown}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          displayOption={displayOption}
          defaultClassNames={defaultClassNames}
          filterOption={filterOption}
          searchOptions={searchOptions}
          showOptionsWhenEmpty={showOptionsWhenEmpty}
        />
      </div>
    );
  }
}

export default TypeaheadTokenizer;
