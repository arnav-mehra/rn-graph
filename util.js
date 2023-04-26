export const vertices = [
    { id: 0, name: 'Node 0' },
    { id: 1, name: 'Node 1' },
    { id: 2, name: 'Node 2' },
    { id: 3, name: 'Node 3' },
    { id: 4, name: 'Node 4' },
    { id: 5, name: 'Node 5' },
    { id: 6, name: 'Node 6' },
    { id: 7, name: 'Node 7' },
    { id: 8, name: 'Node 8' },
    { id: 9, name: 'Node 9' },
    { id: 10, name: 'Node 10' }
]

export const edges = [
    { from: 0, to: 1, directed: false },
    { from: 0, to: 2, directed: false },
    { from: 0, to: 3, directed: false },
    { from: 1, to: 4, directed: false },
    { from: 1, to: 5, directed: false },
    { from: 2, to: 6, directed: false },
    { from: 3, to: 6, directed: false },
    { from: 4, to: 5, directed: false },
    { from: 4, to: 6, directed: false },
    { from: 5, to: 6, directed: false },
    { from: 0, to: 4, directed: false },
    { from: 0, to: 5, directed: false },
    { from: 0, to: 6, directed: false },
    { from: 0, to: 7, directed: false },
    { from: 0, to: 8, directed: false },
    { from: 0, to: 9, directed: false },
    { from: 0, to: 10, directed: false },
]

export const distanceToForce = (distSq, isEdge) => {
    if (distSq < 0.4 * 0.4) return -2 * (0.4 * 0.4 - distSq);
    if (distSq < 0.6 * 0.6) return 0;
    if (!isEdge) return 0;
    return 2 * distSq;
};

export const coordToPixel = x => 300 * x + 150;
export const scalarToPixelDelta = x => 300 * x;
export const pixelToCoord = x => (x - 150) / 300;