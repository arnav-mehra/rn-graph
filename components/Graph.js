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
    style: inputStyle
}) => {
    const { current: style } = useRef(inheritDefaultStyle(inputStyle));

    const [ verts, setVerts ] = useState(objArrCpy(inputVertices));
    const [ edges, setEdges ] = useState(objArrCpy(inputEdges));
    const { current: vertexMap } = useRef(new Map());
    const { current: edgeMap } = useRef(new Map());

    const [ zoom, setZoom ] = useState(500);
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
    }, [window]);

    const { wrapperProps } = useDraggable((e) => {
        pan[0] += e.movementX;
        pan[1] += e.movementY;
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
                border: style.frame.border,
                width: style.frame.width,
                height: style.frame.height,
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

                    zoom={zoom}
                    pan={pan}
                    style={style}
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
                    style={style}
                />
            )}
        </View>
    );
};

export default Graph;