import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Container } from '@five-films/bootstrapper'
import { ServiceType } from './interfaces'

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: '' };
  }

  componentDidMount() {
    const q: Movie.MovieRecommendRequest = { city: '成都' };
    const service: Movie.MovieRecommendService = Container.get<Movie.MovieRecommendService>(ServiceType.TYPE_MOVIE.RECOMMEND);
    service.getRecommendMovies(q).then(response => {
      this.setState({ data: response.reason });
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{this.state.data}</Text>
      </View>
    );
  }
}
