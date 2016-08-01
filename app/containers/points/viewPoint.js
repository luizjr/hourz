import React, { Component } from 'react';
import { connect } from 'react-redux';
import PointView from '../../components/PointView';

class ViewPoint extends Component {
  render() {
    return (
      <PointView point={this.props.point} />
    );
  }
}

mapStateToProps(state, props) {
  return {
    
  };
}
