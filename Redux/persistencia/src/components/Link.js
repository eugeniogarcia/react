import React from 'react'
import PropTypes from 'prop-types'

const Link = ({ estado, children, enClick, filtro }) => (
  <button onClick={enClick} disabled={estado} style={{ marginLeft: "4px",}}>
    {children} ({filtro})
  </button>
);

Link.propTypes = {
  estado: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  enClick: PropTypes.func.isRequired,
};

export default Link
