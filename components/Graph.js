import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import Edge from './Edge';
import Vertex from './Vertex';
import { assignVertexLocations, coordToPixel, distanceToForce, pixelToCoord } from '../util';

const FPS = 480;
const FPS_INV = 1 / FPS;

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
        console.time();
        for (const v of verts) {
            vertexMap[v.id] = v;
        }
        for (const e of eds) {
            edgeMap[e.from] = edgeMap[e.from] || new Map();
            edgeMap[e.from][e.to] = e;
            edgeMap[e.to] = edgeMap[e.to] || new Map();
            edgeMap[e.to][e.from] = e;
        }
        assignVertexLocations(verts, setVerts, edgeMap, vertexMap);
        console.timeEnd();
        setInterval(updateLocation, 1000 / FPS);
    }, []);

    const updateLocation = () => {
        for (let i = 0; i < verts.length; i++) {
            for (let j = i + 1; j < verts.length; j++) {
                const from = verts[i];
                const to = verts[j];
        
                const dx = from.x - to.x;
                const dy = from.y - to.y;
                const dSq = dx * dx + dy * dy;

                const f = distanceToForce(
                    dSq, edgeMap[from.id]?.[to.id] || edgeMap[to.id]?.[from.id]
                );
                if (f == 0) continue;

                const xd = dx * f * FPS_INV;
                const yd = dy * f * FPS_INV;
                
                if (from.fixed) {
                    to.x += 2 * xd;
                    to.y += 2 * yd;
                    continue;
                }
                if (to.fixed) {
                    from.x -= 2 * xd;
                    from.y -= 2 * yd;
                    continue;
                }
                from.x -= xd;
                from.y -= yd;
                to.x += xd;
                to.y += yd;
            }
        }
        setVerts([ ...verts ]);
    };

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

    useEffect(() => {console.log(pan)}, [pan]);

    useEffect(() => {
        if (selected.current) {
            addEventListener('mousemove', handleMouseMove.current)
        } else {
            removeEventListener('mousemove', handleMouseMove.current);
        }
    }, [selected.current]);

    const handleScroll = (e) => {
        const newZoom = Math.max(zoom - e.deltaY / 2, 10);
        
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