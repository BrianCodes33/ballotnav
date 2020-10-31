import React from 'react'
import PropTypes from 'prop-types'
import clx from 'classnames'

const Dropdown = ({
  onChange,
  placeholder,
  active,
  loading,
  focused,
  size,
  selected,
  children,
}) => (
  <div className={clx('select', {
    'is-active': active,
    'is-loading': loading,
    'is-focused': focused,
    'is-small': size === 'small',
    'is-medium': size === 'medium',
    'is-large': size === 'large',
  })}>
    <select
      onChange={e => onChange(e)}
      value={selected}
    >
      { placeholder && (
        <option
          className="select-option"
          key="select-placeholder"
          value=""
          disabled
        >
          { placeholder }
        </option>
      )}
      { children }
    </select>
  </div>
)


export default Dropdown

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  focused: PropTypes.bool,
  size: PropTypes.oneOf(['small', '', 'medium', 'large']),
  selected: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

Dropdown.defaultProps = {
  placeholder: undefined,
  active: false,
  loading: false,
  focused: false,
  size: '',
  selected: '',
  children: null,
}
