export const FPS = 480;
export const FPS_INV = 1 / FPS;

export const vertices = [
    { id: 0, name: 'Node 0' },
    { id: 1, name: 'Node 1' },
    { id: 2, name: 'Node 2' },
    { id: 3, name: 'Node 3' },
    { id: 4, name: 'Node 4' },
    { id: 5, name: 'Node 5' },
    { id: 6, name: 'Node 6' },
]

export const edges = [
    { from: 0, to: 1, directed: false },
    { from: 0, to: 2, directed: false },
    { from: 0, to: 3, directed: false },
    { from: 1, to: 4, directed: false },
    { from: 1, to: 5, directed: false },
    { from: 2, to: 6, directed: false },
    { from: 3, to: 6, directed: false },
]

export const distanceToForce = (distSq, isEdge) => {
    if (distSq < 0.2 * 0.2) return -2;
    if (distSq < 0.4 * 0.4) return 0;
    if (distSq < 0.6 * 0.6) return 0;
    if (!isEdge) return 0;
    return (2 * distSq);
};

export const coordToPixel = (x, y, zoom, pan) => ([
    zoom * x + pan[0],
    zoom * y + pan[1]
]);

export const scalarToPixelDelta = (d, zoom) => zoom * d;

export const pixelToCoord = (px, py, zoom, pan) => ([
    (px - pan[0]) / zoom,
    (py - pan[1]) / zoom
]);

export const initVertexEdgeMaps = (verts, eds, vertexMap, edgeMap) => {
    for (const v of verts) {
        vertexMap[v.id] = v;
    }
    for (const e of eds) {
        edgeMap[e.from] = edgeMap[e.from] || new Map();
        edgeMap[e.from][e.to] = e;
        edgeMap[e.to] = edgeMap[e.to] || new Map();
        edgeMap[e.to][e.from] = e;
    }
}

export const updateLocation = (verts, setVerts, edgeMap) => {
    for (let i = 0; i < verts.length; i++) {
        for (let j = i + 1; j < verts.length; j++) {
            const from = verts[i];
            const to = verts[j];
    
            const dx = from.x - to.x;
            const dy = from.y - to.y;
            const dSq = dx * dx + dy * dy;

            const f = distanceToForce(
                dSq,
                edgeMap[from.id]?.[to.id] || edgeMap[to.id]?.[from.id]
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

export const assignVertexLocations = (verts, setVerts, edgeMap, vertexMap) => {
    if (verts.length == 0) return;

    const seen = new Set();

    for (const v of verts) {
        if (seen.has(v.id)) continue;
        seen.add(v.id);
        v.x = 1;
        v.y = 1;
        dfsLocations(v, seen, 0, edgeMap, vertexMap);
    }

    setVerts([ ...verts ]);
}

export const dfsLocations = (prevPoint, seen, prevTheta, edgeMap, vertexMap) => {
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
        dfsLocations(v, seen, angle - Math.PI, edgeMap, vertexMap);
    });
};
