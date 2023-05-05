import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
    coordToPixel,
    pixelToCoordDelta
} from '../util';

import useMoveSelected from './useMoveSelected';

const Vertex = ({
    v,
    zoom,
    pan
}) => {
    const [ vert, setVert ] = useState(v);
    const [ px, py ] = coordToPixel(vert.x, vert.y, zoom, pan);

    const { selected, wrapperProps } = useMoveSelected((e) => {
        vert.x += pixelToCoordDelta(e.movementX, zoom);
        vert.y += pixelToCoordDelta(e.movementY, zoom);
        setVert(vert);
    });

    useEffect(() => {
        vert.fixed = selected.current;
    }, [selected.current]);

    return (
        <View
            style={{
                position: 'absolute',
                left: px,
                top: py,
                zIndex: 1,
                cursor: 'pointer'
            }}
            {...wrapperProps}
        >
            <View
                style={{
                    backgroundColor: 'red',
                    borderRadius: '50%',

                    width: 60,
                    height: 60,
                    marginLeft: '-50%',
                    marginTop: '-50%',
                    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    {vert.name}
                </Text>
            </View>
        </View>
    )
};

export default Vertex;