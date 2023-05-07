import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import {
    coordToPixel,
    pixelToCoordDelta
} from '../util';

import useDraggable from './useDraggable';
import CenteredView from './CenteredView';


const Vertex = ({
    vert,
    zoom,
    pan,
    style
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
            <View
                style={{
                    backgroundColor: style.vertices.color,
                    borderRadius: style.vertices.radius,
                    width: style.vertices.size,
                    height: style.vertices.size,
                    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: style.vertices.textColor,
                        fontWeight: style.vertices.textWeight,
                    }}
                >
                    {vert.label}
                </Text>
            </View>
        </CenteredView>
    )
};

export default Vertex;