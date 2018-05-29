import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class TypeaheadOption extends Component {
  static propTypes = {
    customClasses: PropTypes.object,
    customValue: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string,
    hover: PropTypes.bool,
  };

  static defaultProps = {
    customClasses: {},
    onClick(event) {
      event.preventDefault();
    },
  };

  handleOnClick = event => {
    event.preventDefault();
    this.props.onClick(event);
  };

  render() {
    const { customClasses, hover, customValue, children } = this.props;

    const classList = classNames(customClasses.listItem, {
      [customClasses.hover || 'hover']: !!hover,
      [customClasses.customAdd]: !!customValue,
    });

    return (
      <li className={classList} onClick={this.handleOnClick} onMouseDown={this.handleOnClick}>
        <a
          className={classNames('typeahead-option', customClasses.listAnchor)}
          ref={n => {
            this.anchor = n;
          }}
        >
          {children}
        </a>
      </li>
    );
  }
}

export default TypeaheadOption;
