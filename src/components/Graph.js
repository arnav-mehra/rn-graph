import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import {
    inheritDefaultStyle,
    initVertexLocations,
    initVertexEdgeMaps,
    initPanAndZoom,
    updateLocation,
    inheritDefaultSettings,
} from '../node-graph-viz/src/util';

import useFrame from './useFrame';
import VertexWrapper from './VertexWrapper';
import Edge from './Edge';

const Graph = ({
    vertices: inputVertices,
    edges: inputEdges,
    styles: inputStyles,
    settings: inputSettings,
    VertexComponent
}) => {
    const { current: settings } = useRef(inheritDefaultSettings(inputSettings));
    const { current: styles } = useRef(inheritDefaultStyle(inputStyles));
    const [ verts, setVerts ] = useState(inputVertices);
    const [ edges, setEdges ] = useState(inputEdges);

    // maps for ez lookup
    const { current: vertexMap } = useRef(new Map());
    const { current: edgeMap } = useRef(new Map());

    const frameIntervalRef = useRef();

    const {
        zoom, setZoom,
        pan, setPan,
        window, setWindow,
        handleScroll,
        panFrameProps
    } = useFrame();

    // make reactive to input changes
    useEffect(() => {
        setVerts(inputVertices);
        setEdges(inputEdges);
    }, [ inputVertices, inputEdges ]);

    // initialize maps & view.
    useEffect(() => {
        if (!window) return;

        // init maps and vert locations

        initVertexEdgeMaps(verts, edges, vertexMap, edgeMap);
        initVertexLocations(verts, edgeMap, vertexMap);    

        const zoom = initPanAndZoom(verts, window);
        setZoom(zoom);

        setVerts([ ...verts ]);

        // init vertex updates if non-static vs. static

        if (!settings.static && !frameIntervalRef.current) {
            frameIntervalRef.current = setInterval(
                () => {
                    updateLocation(verts, edgeMap);
                    setVerts([ ...verts ]);
                },
                1000 / settings.fps
            );
        }
        else if (settings.static) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = undefined;
        }
        return () => {
            clearInterval(frameIntervalRef.current);
        }
    }, [ window, settings.static ]);

    return (
        <View
            style={{
                ...styles.frame,
                overflow: 'hidden',
                position: 'relative'
            }}
            onWheel={handleScroll}
            onLayout={e => setWindow(e.nativeEvent.layout)}
            {...panFrameProps}
        >
            {verts.map(v =>
                <VertexWrapper
                    key={v.id}
                    vert={v}
                    zoom={zoom}
                    pan={pan}
                >
                    <VertexComponent
                        vert={v}
                        style={styles.vertexStylePresets[v.style || 0]}
                    />
                </VertexWrapper>
            )}
            {edges.map(e => {
                const from = vertexMap[e.from];
                const to = vertexMap[e.to];
                if (!from || !to) return null;
                return (
                    <Edge
                        key={`${e.from}-${e.to}`}
                        edge={e}
                        from={from}
                        to={to}
                        style={styles.edgeStylePresets[e.style || 0]}
                        fromStyle={styles.vertexStylePresets[from.style || 0]}
                        toStyle={styles.vertexStylePresets[to.style || 0]}
                        zoom={zoom}
                        pan={pan}
                    />
                )
            })}
        </View>
    );
};

export default Graph;