import { StyleSheet, View } from 'react-native';
import { VertexComponent, edges, vertices } from './testData';

import Graph from './components/Graph';

const App = () => {
  return (
    <View style={styles.container}>
      <Graph
        vertices={vertices}
        edges={edges}
        settings={{
          static: false
        }}
        VertexComponent={VertexComponent}
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