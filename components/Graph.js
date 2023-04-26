import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import Edge from './Edge';
import Vertex from './Vertex';
import { distanceToForce } from '../util';

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
        assignVertexLocations();
        console.timeEnd();
        setInterval(updateLocation, 1000 / FPS);
    }, []);

    const assignVertexLocations = () => {
        if (verts.length == 0) return;

        const seen = new Set();

        for (const v of verts) {
            if (seen.has(v.id)) continue;
            seen.add(v.id);
            v.x = 1;
            v.y = 1;
            dfsLocations(v, seen, 0);
        }

        setVerts([ ...verts ]);
    }

    const dfsLocations = (prevPoint, seen, prevTheta) => {
        const edgesMap = edgeMap[prevPoint.id] || {};
        const edges = Object.values(edgesMap);

        const filteredEdges = edges.filter(e => !seen.has(e.to));
        filteredEdges.forEach(e => seen.add(e.to));
        console.log({edges})

        const theta = (1 / edges.length) * (2 * Math.PI);
        filteredEdges.forEach((e, i) => {
            const v = vertexMap[e.to];
            const angle = theta * (i + 1) + prevTheta;
            v.x = prevPoint.x + Math.cos(angle) * 0.5;
            v.y = prevPoint.y + Math.sin(angle) * 0.5;
            dfsLocations(v, seen, angle - Math.PI);
        });
    };

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

    return (
        <>
            {vertices.map(v =>
                <Vertex
                    v={v}
                    key={v.id}
                />
            )}
            {edges.map(e => 
                <Edge
                    key={`${e.from}-${e.to}`}
                    from={vertexMap[e.from]}
                    to={vertexMap[e.to]}
                    edge={e}
                />
            )}
        </>
    );
};

export default Graph;