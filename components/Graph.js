import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import Edge from './Edge';
import Vertex from './Vertex';

import {
    assignVertexLocations,
    initVertexEdgeMaps,
    pixelToCoord,
    updateLocation,
    FPS
} from '../util';

const Graph = ({
    vertices,
    edges
}) => {
    const [ verts, setVerts ] = useState(vertices);
    const [ eds, setEds ] = useState(edges);

    const vertexMapRef = useRef(new Map());
    const vertexMap = vertexMapRef.current;
    const edgeMapRef = useRef(new Map());
    const edgeMap = edgeMapRef.current;

    useEffect(() => {
        initVertexEdgeMaps(verts, eds, vertexMap, edgeMap);
        assignVertexLocations(verts, setVerts, edgeMap, vertexMap);
        setInterval(() => updateLocation(verts, setVerts, edgeMap), 1000 / FPS);
    }, []);

    const selected = useRef(false);
    const [ zoom, setZoom ] = useState(500);
    const [ pan, setPan ] = useState([ 0, 0 ]);

    const handleMouseMove = useRef(e => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (!selected.current) return;
        pan[0] += e.movementX;
        pan[1] += e.movementY;
        setPan(pan);
    })

    useEffect(() => {
        if (selected.current) {
            addEventListener('mousemove', handleMouseMove.current)
        } else {
            removeEventListener('mousemove', handleMouseMove.current);
        }
    }, [selected.current]);

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
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
            onMouseDown={() => selected.current = true}
            onMouseUp={() => selected.current = false}
            onWheel={handleScroll}
        >
            {vertices.map(v =>
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