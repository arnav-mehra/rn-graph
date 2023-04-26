import { StyleSheet, View } from 'react-native';
import { edges, vertices } from './util';

import Graph from './components/Graph';

const App = () => {
  return (
    <View style={styles.container}>
      <Graph
        vertices={vertices}
        edges={edges}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;