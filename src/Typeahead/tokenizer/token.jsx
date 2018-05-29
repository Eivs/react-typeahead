import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */

class Token extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.string,
    object: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onRemove: PropTypes.func,
    value: PropTypes.string,
  };

  renderHiddenInput() {
    const { name, value, object } = this.props;
    // If no name was set, don't create a hidden input
    if (!name) {
      return null;
    }

    return <input type="hidden" name={`${name}[]`} value={value || object} />;
  }

  renderCloseButton() {
    const { onRemove, className, object } = this.props;

    if (!onRemove) {
      return null;
    }

    return (
      <button
        className={className || 'typeahead-token-close'}
        onClick={event => {
          onRemove(object);
          event.preventDefault();
        }}
      >
        &#x00d7;
      </button>
    );
  }

  render() {
    const { children } = this.props;
    const className = classNames(['typeahead-token', this.props.className]);

    return (
      <div className={className}>
        {this.renderHiddenInput()}
        {children}
        {this.renderCloseButton()}
      </div>
    );
  }
}

export default Token;
