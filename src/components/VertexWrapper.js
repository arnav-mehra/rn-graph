import React, { useEffect } from 'react';

import {
    coordToPixel,
    pixelToCoordDelta
} from '../util';

import useDraggable from './useDraggable';
import CenteredView from './CenteredView';
import { View } from 'react-native';

const VertexWrapper = ({
    vert,
    zoom,
    pan,
    children
}) => {
    // make vertex draggable.
    const { selected, wrapperProps } = useDraggable(
        (e, deps) => {
            const [ zoom ] = deps;
            vert.x += pixelToCoordDelta(e.movementX, zoom);
            vert.y += pixelToCoordDelta(e.movementY, zoom);
        },
        [ zoom ] // dependency array.
    );

    // track vertex selection for attract/repel effect.
    useEffect(() => {
        vert.fixed = selected.current;
    }, [selected.current]);

    // virtual coords -> pixel coords
    const [ px, py ] = coordToPixel(vert.x, vert.y, zoom, pan);

    // render vertex.
    return (
        <CenteredView
            left={px}
            top={py}
            {...wrapperProps}
        >
            {children}
        </CenteredView>
    )
};

export default VertexWrapper;