import React, { useState } from 'react'
import useDraggable from './useDraggable';
import { pixelToCoord } from '../node-graph-viz/src/util';

const useFrame = () => {
    const [ zoom, setZoom ] = useState(500);
    const [ pan, setPan ] = useState([ 0, 0 ]);
    const [ window, setWindow ] = useState();

    // pan event handler
    const { wrapperProps: panFrameProps } = useDraggable((e) => {
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

    return {
        zoom, setZoom,
        pan, setPan,
        window, setWindow,
        handleScroll,
        panFrameProps
    };
};

export default useFrame;