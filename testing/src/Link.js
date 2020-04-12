import React from 'react';

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

export default class Link extends React.Component {
  constructor(props) {
    super(props);

    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onMouseEnter() {
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave() {
    this.setState({class: STATUS.NORMAL});
  }

  render() {
    return (
      <div id='zona' onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
        {this.props.nombre ? "Hola " + this.props.nombre + " " + this.props.apellido + ", el estado es " + this.state.class : "El estado es " + this.state.class}
        <br/>
        {this.props.children}
      </div>
    );
  }
}