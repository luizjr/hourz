import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import PointListItem from './PointListItem';
import Color from '../resource/color';

/**
 * Lista de pontos batidos
 */
class PointList extends Component {

  /**
   * construtor do component
   * @param  {Object} props
   * @return {void}
   */
  constructor(props) {
    super(props);

    // dataSource -> lista de pontos
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource
    }
  }

  /**
   * Component Lifecycle Method
   * @return {void}
   */
  componentDidMount() {
    // popula o dataSource com os pontos
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(this.props.points)
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(newProps.points)
    });
  }

  /**
   * renderiza a linha do listView
   * @param  {object} point -> ponto
   * @param  {number} idSec -> id da sequência
   * @param  {number} idRow -> id da linha
   * @return {ReactElement} PointListItem
   */
  renderRow(point, idSec, idRow) {
    return (
      <PointListItem key={point.key} point={point} disabled={this.props.refreshing} />
    );
  }

  renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return (<View style={{borderWidth:0.3, borderColor:'#b6b6b6'}} key={`sep:${sectionId}:${rowId}`} />);
  }

  /**
   * renderiza a lista de pontos
   * @return {ReactElement}
   */
  renderPointList() {

      // caso não tenha ponto, retorna a mensagem
      if(this.props.points.length === 0) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{fontSize: 20}}>
              Você ainda não bateu o ponto Hoje!
            </Text>
          </View>
        );
      }

      // retorna a ListView
      return (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator}
            style={styles.listView}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={() => {
                  this.props.onRefresh && this.props.onRefresh()}
                }
                colors={[Color.color.PrimaryColor]}
              />
            }
          />
      );
  }

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {
    return (
      <View style={styles.container}>
        {this.renderPointList()}
      </View>
    );
  }
}

// Props do componente
PointList.propTypes = {
  points: PropTypes.array.isRequired
}

// Estilo do componente
var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listView: {
      backgroundColor: '#F5FCFF'
    }
});

export default PointList;
