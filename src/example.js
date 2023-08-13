import { Text, View } from "react-native";

const exampleVertices = [
    { id: 0, label: 'Node 0' },
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
    { id: 6, label: 'Node 6' },
];

const exampleEdges = [
    { from: 0, to: 1, directed: 2, label: 'Edge 0' },
    { from: 0, to: 2, directed: true, label: 'Edge 1' },
    { from: 0, to: 3, directed: true, label: 'Edge 2' },
    { from: 1, to: 4, directed: true, label: 'Edge 3' },
    { from: 1, to: 5, directed: true, label: 'Edge 4' },
    { from: 2, to: 6, directed: true, label: 'Edge 5' },
    { from: 3, to: 6, directed: true, label: 'Edge 6' },
];

const ExampleVertexComponent = ({
    vert,
    style
}) => (
    <View
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: style.color,
            borderRadius: style.radius,
            width: style.size,
            height: style.size,
        }}
    >
        <Text
            style={{
                color: style.textColor,
                fontWeight: style.textWeight,
            }}
        >
            {vert.label}
        </Text>
    </View>
);

const ExampleGraph = () => (
    <Graph
        vertices={exampleVertices}
        edges={exampleEdges}
        settings={{
          static: false
        }}
        VertexComponent={ExampleVertexComponent}
    />
);

export default ExampleGraph;