import React, { useEffect, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import Edge from './Edge';
import Vertex from './Vertex';

import {
    initVertexLocations,
    initVertexEdgeMaps,
    pixelToCoord,
    updateLocation,
    FPS,
    objArrCpy,
    initPanAndZoom,
    DEFAULT_ZOOM
} from '../util';
import useMoveSelected from './useMoveSelected';

const Graph = ({
    vertices: inputVertices,
    edges: inputEdges,
    width: inputWidth,
    height: inputHeight
}) => {
    const [ verts, setVerts ] = useState(objArrCpy(inputVertices));
    const [ edges, setEdges ] = useState(objArrCpy(inputEdges));

    const { current: vertexMap } = useRef(new Map());
    const { current: edgeMap } = useRef(new Map());

    const [ zoom, setZoom ] = useState(DEFAULT_ZOOM);
    const [ pan, setPan ] = useState([ 0, 0 ]);
    const [ window, setWindow ] = useState();

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
    }, [window])

    const { wrapperProps } = useMoveSelected((e) => {
        pan[0] += e.movementX;
        pan[1] += e.movementY;
        console.log(pan)
        setPan(pan);
    });

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
                border: '10px solid black',
                width: inputWidth,
                height: inputHeight,
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
                    v={v}
                    zoom={zoom}
                    pan={pan}
                />
            )}
            {edges.map(e => 
                <Edge
                    key={`${e.from}-${e.to}`}
                    from={vertexMap[e.from]}
                    to={vertexMap[e.to]}
                    edge={e}
                    zoom={zoom}
                    pan={pan}
                />
            )}
        </View>
    );
};

export default Graph;