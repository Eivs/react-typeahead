import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import fuzzy from '../utils/fuzzy';
import Accessor from '../utils/accessor';
import KeyEvent from '../utils/keyevent';

import TypeaheadSelector from './selector';

// eslint-disable-next-line
const noop = params => {};

class Typeahead extends Component {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    customClasses: PropTypes.object,
    maxVisible: PropTypes.number,
    resultsTruncatedMessage: PropTypes.string,
    options: PropTypes.array,
    allowCustomValues: PropTypes.number,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    textarea: PropTypes.bool,
    inputProps: PropTypes.object,
    onOptionSelected: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchOptions: PropTypes.func,
    displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputDisplayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    formInputOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    defaultClassNames: PropTypes.bool,
    customListComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    showOptionsWhenEmpty: PropTypes.bool,
  };

  static defaultProps = {
    options: [],
    customClasses: {},
    allowCustomValues: 0,
    initialValue: '',
    value: '',
    placeholder: '',
    disabled: false,
    textarea: false,
    inputProps: {},
    onOptionSelected: noop,
    onChange: noop,
    onKeyDown: noop,
    onKeyPress: noop,
    onKeyUp: noop,
    onFocus: noop,
    onBlur: noop,
    filterOption: null,
    searchOptions: null,
    inputDisplayOption: null,
    defaultClassNames: true,
    customListComponent: TypeaheadSelector,
    showOptionsWhenEmpty: false,
    resultsTruncatedMessage: null,
  };

  constructor(props) {
    super(props);
    const { value, initialValue, options } = props;

    this.state = {
      entryValue: value || initialValue,
      selection: value,
      selectionIndex: null,
      isFocused: false,
      showResults: false,
      searchResults: this.getOptionsForValue(initialValue, options),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { entryValue, isFocused } = this.state;
    const searchResults = this.getOptionsForValue(entryValue, nextProps.options);
    const showResults = Boolean(searchResults.length) && isFocused;
    this.setState({
      searchResults,
      showResults,
    });
  }

  getCustomValue = () => {
    if (this.hasCustomValue()) {
      return this.state.entryValue;
    }
    return null;
  };

  setEntryText = value => {
    this.entry.value = value;
    this.handleOnTextEntryUpdated();
  };

  getOptionsForValue = (value, options) => {
    if (this.shouldSkipSearch(value)) {
      return [];
    }

    const searchOptions = this.generateSearchFunction();
    return searchOptions(value, options);
  };

  getSelection = () => {
    const { selectionIndex, entryValue, searchResults } = this.state;

    let index = selectionIndex;
    if (this.hasCustomValue()) {
      if (index === 0) {
        return entryValue;
      }
      index -= 1;
    }
    return searchResults[index];
  };

  shouldSkipSearch = input => {
    const { showOptionsWhenEmpty } = this.props;
    const emptyValue = !input || input.trim().length === 0;

    const isFocused = this.state && this.state.isFocused;
    return !(showOptionsWhenEmpty && isFocused) && emptyValue;
  };

  hasCustomValue = () => {
    const { allowCustomValues } = this.props;
    const { entryValue, searchResults } = this.state;

    if (
      allowCustomValues > 0 &&
      entryValue.length >= allowCustomValues &&
      !searchResults.includes(entryValue)
    ) {
      return true;
    }
    return false;
  };

  focus = () => {
    this.entry.focus();
  };

  eventMap = () => {
    const events = {};

    events[KeyEvent.DOM_VK_UP] = this.handleNavUp;
    events[KeyEvent.DOM_VK_DOWN] = this.handleNavDown;
    events[KeyEvent.DOM_VK_RETURN] = this.handleOnEnter;
    events[KeyEvent.DOM_VK_ENTER] = this.handleOnEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this.handleOnEscape;
    events[KeyEvent.DOM_VK_TAB] = this.handleOnTab;

    return events;
  };

  nav = delta => {
    if (!this.hasHint()) {
      return;
    }

    const { selectionIndex, searchResults } = this.state;
    const { maxVisible } = this.props;

    let newIndex;

    if (selectionIndex === null) {
      newIndex = delta === 1 ? 0 : delta;
    } else {
      newIndex = selectionIndex + delta;
    }

    let length = maxVisible ? searchResults.slice(0, maxVisible).length : searchResults.length;

    if (this.hasCustomValue()) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    this.setState({ selectionIndex: newIndex });
  };

  generateSearchFunction = () => {
    const { searchOptions, filterOption } = this.props;
    if (typeof searchOptions === 'function') {
      if (filterOption !== null) {
        console.warn('searchOptions prop is being used, filterOption prop will be ignored');
      }
      return searchOptions;
    } else if (typeof filterOption === 'function') {
      return (value, options) => options.filter(o => filterOption(value, o));
    }

    let mapper;
    if (typeof filterOption === 'string') {
      mapper = Accessor.generateAccessor(filterOption);
    } else {
      mapper = Accessor.IDENTITY_FN;
    }
    return (value, options) =>
      fuzzy.filter(value, options, { extract: mapper }).map(res => options[res.index]);
  };

  hasHint = () => this.state.searchResults.length > 0 || this.hasCustomValue();

  handleOnOptionSelected = (option, event) => {
    const { entry } = this;
    const { generateOptionToStringFor } = Accessor;
    const {
      inputDisplayOption,
      options,
      formInputOption,
      onOptionSelected,
      displayOption,
    } = this.props;

    entry.focus();

    const getDisplayOption = generateOptionToStringFor(inputDisplayOption || displayOption);
    const optionString = getDisplayOption(option, 0);

    const getFormInputOption = generateOptionToStringFor(formInputOption || getDisplayOption);
    const formInputOptionString = getFormInputOption(option);

    entry.value = optionString;

    this.setState({
      searchResults: this.getOptionsForValue(optionString, options),
      selection: formInputOptionString,
      entryValue: optionString,
      showResults: false,
    });

    return onOptionSelected(option, event);
  };

  handleOnTextEntryUpdated = () => {
    const { value } = this.entry;
    const { options } = this.props;

    this.setState({
      searchResults: this.getOptionsForValue(value, options),
      selection: '',
      entryValue: value,
    });
  };

  handleOnEnter = event => {
    const selection = this.getSelection();
    const { onKeyDown } = this.props;

    if (!selection) {
      return onKeyDown(event);
    }

    return this.handleOnOptionSelected(selection, event);
  };

  handleOnEscape = () => {
    this.setState({
      selectionIndex: null,
      showResults: false,
    });
  };

  handleOnTab = event => {
    const { searchResults } = this.state;
    const selection = this.getSelection();

    let option = selection || (searchResults.length > 0 ? searchResults[0] : null);

    if (option === null && this.hasCustomValue()) {
      option = this.getCustomValue();
    }

    if (option !== null) {
      this.handleOnOptionSelected(option, event);
    }
  };

  handleOnChange = event => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(event);
    }

    this.handleOnTextEntryUpdated();
  };

  handleOnKeyDown = event => {
    const { onKeyDown } = this.props;

    if (!this.hasHint() || event.shiftKey) {
      return onKeyDown(event);
    }

    const handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return onKeyDown(event);
    }

    return event.preventDefault();
  };

  handleOnFocus = event => {
    const { onFocus } = this.props;

    this.setState({ isFocused: true, showResults: true }, this.handleOnTextEntryUpdated);

    if (onFocus) {
      onFocus(event);
    }
  };

  handleOnBlur = event => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false }, this.handleOnTextEntryUpdated);

    if (onBlur) {
      onBlur(event);
    }
  };

  handleNavDown = () => {
    this.nav(1);
  };

  handleNavUp = () => {
    this.nav(-1);
  };

  renderHiddenInput = () => {
    const { name } = this.props;
    const { selection } = this.state;

    if (!name) {
      return null;
    }

    return <input type="hidden" name={name} value={selection} />;
  };

  renderIncrementalSearchResults = () => {
    const { entryValue, selection, searchResults, selectionIndex } = this.state;
    const { customListComponent: CustomListComponent } = this.props;
    const {
      maxVisible,
      resultsTruncatedMessage,
      allowCustomValues,
      customClasses,
      defaultClassNames,
      displayOption,
    } = this.props;

    if (this.shouldSkipSearch(entryValue)) {
      return null;
    }

    if (selection) {
      return null;
    }

    return (
      <CustomListComponent
        ref={n => {
          this.sel = n;
        }}
        options={maxVisible ? searchResults.slice(0, maxVisible) : searchResults}
        areResultsTruncated={maxVisible && searchResults.length > maxVisible}
        resultsTruncatedMessage={resultsTruncatedMessage}
        onOptionSelected={this.handleOnOptionSelected}
        allowCustomValues={allowCustomValues}
        customValue={this.getCustomValue()}
        customClasses={customClasses}
        selectionIndex={selectionIndex}
        defaultClassNames={defaultClassNames}
        displayOption={Accessor.generateOptionToStringFor(displayOption)}
      />
    );
  };

  render() {
    const {
      customClasses,
      defaultClassNames,
      className,
      textarea,
      disabled,
      inputProps,
      placeholder,
      onKeyPress,
      onKeyUp,
    } = this.props;
    const { entryValue, showResults } = this.state;

    const InputElement = textarea ? 'textarea' : 'input';
    return (
      <div className={classNames(className, { typeahead: defaultClassNames })}>
        {this.renderHiddenInput()}
        <InputElement
          ref={n => {
            this.entry = n;
          }}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          {...inputProps}
          className={classNames(customClasses.input)}
          value={entryValue}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
        />
        {showResults && this.renderIncrementalSearchResults()}
      </div>
    );
  }
}

export default Typeahead;
