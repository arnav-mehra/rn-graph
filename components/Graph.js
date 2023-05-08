import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import {
    FPS,
    objArrCpy,
    inheritDefaultStyle,
    pixelToCoord,
    initVertexLocations,
    initVertexEdgeMaps,
    initPanAndZoom,
    updateLocation,
} from '../util';

import Edge from './Edge';
import Vertex from './Vertex';
import useDraggable from './useDraggable';


const Graph = ({
    vertices: inputVertices,
    edges: inputEdges,
    styles: inputStyles
}) => {
    const [ styles, setStyles ] = useState(inheritDefaultStyle(inputStyles));
    const [ verts, setVerts ] = useState(inputVertices);
    const [ edges, setEdges ] = useState(inputEdges);

    // make reactive to input changes
    useEffect(() => {
        setVerts(inputVertices);
        setEdges(inputEdges);
        setStyles(inheritDefaultStyle(inputStyles));
    }, [ inputStyles, inputVertices, inputEdges ]);

    // maps for fast lookup
    const { current: vertexMap } = useRef(new Map());
    const { current: edgeMap } = useRef(new Map());

    // pan and zoom
    const [ zoom, setZoom ] = useState(500);
    const [ pan, setPan ] = useState([ 0, 0 ]);
    const [ window, setWindow ] = useState();

    // initialize maps & view.
    useEffect(() => {
        if (!window) return;

        initVertexEdgeMaps(verts, edges, vertexMap, edgeMap);
        initVertexLocations(verts, edgeMap, vertexMap);    
        const zoom = initPanAndZoom(verts, window);
        setZoom(zoom);

        setVerts([ ...verts ]);

        setInterval(() => {
            updateLocation(verts, edgeMap);
            setVerts([ ...verts ]);
        }, 1000 / FPS);
    }, [ window ]);

    // pan event handler
    const { wrapperProps } = useDraggable((e) => {
        pan[0] += e.movementX;
        pan[1] += e.movementY;
        setPan(pan);
    });

    // zoom event handler
    const handleScroll = (e) => {
        const newZoom = Math.max(zoom - e.deltaY / 5, 10);
        
        const [ x, y ] = pixelToCoord(e.clientX, e.clientY, zoom, pan);
        pan[0] += x * (zoom - newZoom);
        pan[1] += y * (zoom - newZoom);

        setZoom(newZoom);
        setPan(pan);
    };

    return (
        <View
            style={{
                border: styles.frame.border,
                width: styles.frame.width,
                height: styles.frame.height,
                overflow: 'hidden',
                position: 'relative'
            }}
            onWheel={handleScroll}
            onLayout={e => setWindow(e.nativeEvent.layout)}
            {...wrapperProps}
        >
            {verts.map((v) =>
                <Vertex
                    key={v.id}
                    vert={v}
                    style={styles.vertices[v.style || 0]}
                    zoom={zoom}
                    pan={pan}
                />
            )}
            {edges.map(e => {
                const from = vertexMap[e.from];
                const to = vertexMap[e.to];
                if (!from || !to) return null;
                return (
                    <Edge
                        key={`${e.from}-${e.to}`}
                        edge={e}
                        style={styles.edges[e.style || 0]}
                        from={from}
                        fromStyle={styles.vertices[from.style || 0]}
                        to={to}
                        toStyle={styles.vertices[to.style || 0]}
                        zoom={zoom}
                        pan={pan}
                    />
                )
            })}
        </View>
    );
};

export default Graph;