import React, { Component, PropTypes } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import JobItem from './JobItem';

/**
 * Lista de jobs batidos
 */
class JobList extends Component {

  /**
   * construtor do component
   * @param  {Object} props
   * @return {void}
   */
  constructor(props) {
    super(props);

    // dataSource -> lista de jobs
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
    // popula o dataSource com os jobs
    console.log('jobs ',this.props.jobs);
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(this.props.jobs)
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(newProps.jobs)
    });
  }

  /**
   * renderiza a linha do listView
   * @param  {object} job -> job
   * @param  {number} idSec -> id da sequência
   * @param  {number} idRow -> id da linha
   * @return {ReactElement} JobItem
   */
  renderRow(job, idSec, idRow) {
    return (
      <JobItem key={job.key} job={job} />
    );
  }

  /**
   * renderiza a lista de jobs
   * @return {ReactElement}
   */
  renderPointList() {

      // caso não tenha job, retorna a mensagem
      if(this.props.jobs.length === 0) {
        return (
          <View
            style={styles.empty}
          >
            <Text style={{fontSize: 20}}>
              Você ainda não possui emprego.
            </Text>
          </View>
        );
      }

      // retorna a ListView
      return (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            style={styles.listView}
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
JobList.propTypes = {
  jobs: PropTypes.array.isRequired
}

// Estilo do componente
var styles = StyleSheet.create({
  container: {
      flex: 1
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  listView: {
    backgroundColor: '#F5FCFF'
  }
});

export default JobList;
