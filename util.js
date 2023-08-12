export const FPS = 480;
export const FPS_INV = 1 / FPS;

export const DEFAULT_SETTINGS = {
    static: false,
};

export const DEFAULT_STYLE = {
    vertices: {
        textColor: 'white',
        textWeight: 'bold',
        textSize: 20,
        color: 'red',
        radius: '50%',
        size: 60
    },
    frame: {
        width: '100vw',
        height: '100vh',
        border: '10px solid black',
    },
    edges: {
        line: {
            color: 'black',
            width: 2
        },
        arrow: {
            size: 12,
            color: 'black',
            width: 2,
            fill: 'white'
        },
        label: {
            color: 'black',
            size: 12,
            weight: 'normal'
        }
    }
};

export const inheritDefaultSettings = (inputSettings) => ({
    ...inputSettings,
    ...DEFAULT_SETTINGS
});

export const inheritDefaultStyle = (inputStyles) => ({
    frame: { ...DEFAULT_STYLE.frame, ...inputStyles?.frame },
    
    vertices: inputStyles?.vertices?.map(
        s => ({ ...DEFAULT_STYLE.vertices, ...s })
    ) || [ DEFAULT_STYLE.vertices ],

    edges: inputStyles?.edges?.map(
        s => ({
            line: { ...DEFAULT_STYLE.edges.line, ...s?.line },
            arrow: { ...DEFAULT_STYLE.edges.arrow, ...s?.arrow },
            label: { ...DEFAULT_STYLE.edges.label, ...s?.label }
        })
    ) || [ DEFAULT_STYLE.edges ]
});

export const objArrCpy = (arr) => arr.map(o => ({ ...o }));

const c1 = (0.5 + 0.25 * Math.sqrt(3));
const c2 = (0.5 - 0.25 * Math.sqrt(3));
const triCoordStrCache = new Map();
export const getTriangleCoordStr = (size) => {
    if (triCoordStrCache[size]) return triCoordStrCache[size];
    const str = `${size / 4},${size * c1} ${size / 4},${size * c2} ${size},${size / 2}`;
    triCoordStrCache[size] = str;
    return str;
};

// COORDINATE TRANSFORMS

export const coordToPixelDelta = (d, zoom) => zoom * d;

export const pixelToCoordDelta = (d, zoom) => d / zoom;

export const pixelToCoord = (px, py, zoom, pan) => ([
    (px - pan[0]) / zoom,
    (py - pan[1]) / zoom
]);

export const coordToPixel = (x, y, zoom, pan) => ([
    zoom * x + pan[0],
    zoom * y + pan[1]
]);

// INTIALIZATION

export const initVertexEdgeMaps = (verts, eds, vertexMap, edgeMap) => {
    // clear maps
    vertexMap.clear();
    edgeMap.clear();
    // repopulate maps
    for (const v of verts) {
        vertexMap[v.id] = v;
    }
    for (const e of eds) {
        edgeMap[e.from] = edgeMap[e.from] || new Map();
        edgeMap[e.from][e.to] = e;
        edgeMap[e.to] = edgeMap[e.to] || new Map();
        edgeMap[e.to][e.from] = e;
    }
};

export const initVertexLocations = (verts, edgeMap, vertexMap) => {
    if (verts.length == 0) return;

    const seen = new Set();

    for (const v of verts) {
        if (seen.has(v.id)) continue;
        seen.add(v.id);
        v.x = 1;
        v.y = 1;
        dfsLocations(v, seen, 0, edgeMap, vertexMap);
    }
};

export const dfsLocations = (prevPoint, seen, prevTheta, edgeMap, vertexMap) => {
    const edgesMap = edgeMap[prevPoint.id] || {};
    const edges = Object.values(edgesMap);

    const filteredEdges = [];
    for (const e of edges) {
        if (seen.has(e.to)) continue;
        seen.add(e.to);
        filteredEdges.push(e);
    }

    const theta = (1 / edges.length) * (2 * Math.PI);
    for (let i = 0; i < filteredEdges.length; i++) {
        const e = filteredEdges[i];
        const v = vertexMap[e.to];
        const angle = theta * (i + 1) + prevTheta;
        v.x = prevPoint.x + Math.cos(angle) * 0.5;
        v.y = prevPoint.y + Math.sin(angle) * 0.5;
        dfsLocations(v, seen, angle - Math.PI, edgeMap, vertexMap);
    }
};

export const initPanAndZoom = (verts, window) => {    
    // get coord avg
    let xVal = 0;
    let yVal = 0;
    for (const v of verts) {
        xVal += v.x;
        yVal += v.y;
    }
    const len = 1 / verts.length;
    xVal *= len;
    yVal *= len;

    // normalize
    let farthestX = 0;
    let farthestY = 0;
    for (const v of verts) {
        v.x -= xVal;
        v.y -= yVal;
        farthestX = Math.max(farthestX, Math.abs(v.x));
        farthestY = Math.max(farthestY, Math.abs(v.y));
    }

    const zoom = Math.max(
        window.width / (farthestX * 3),
        window.height / (farthestY * 3)
    );

    // recenter vertices
    const center = pixelToCoord(
        window.width / 2,
        window.height / 2,
        zoom, [ 0, 0 ]
    );
    for (const v of verts) {
        v.x += center[0];
        v.y += center[1];
    }

    return zoom;
};

// INCREMENTAL UPDATES

export const distanceToForce = (distSq, isEdge) => {
    if (distSq < 0.4 * 0.4) return -4; // repel
    if (!isEdge) return 0; // no edge, no attract. neutral
    if (distSq < 0.6 * 0.6) return 0; // neutral
    return (4 * distSq); // attract
};

export const updateLocation = (verts, edgeMap) => {
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
            }
            else if (to.fixed) {
                from.x -= 2 * xd;
                from.y -= 2 * yd;
            }
            else {
                from.x -= xd;
                from.y -= yd;
                to.x += xd;
                to.y += yd;
            }
        }
    }
};