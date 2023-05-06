import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
    coordToPixel,
    pixelToCoord,
    pixelToCoordDelta
} from '../util';

import useMoveSelected from './useMoveSelected';

const Vertex = ({
    v,
    zoom,
    pan
}) => {
    const [ vert, setVert ] = useState(v);
    
    const { selected, wrapperProps } = useMoveSelected((e) => {
        // let [ x, y ] = coordToPixel(vert.x, vert.y, zoom, pan);
        // x += e.movementX;
        // y += e.movementY;
        // [ vert.x, vert.y ] = pixelToCoord(x, y, zoom, pan)
        
        vert.x += pixelToCoordDelta(e.movementX, zoom);
        vert.y += pixelToCoordDelta(e.movementY, zoom);
        console.log(vert.x, vert.y)
        setVert(vert);
    });

    useEffect(() => {
        vert.fixed = selected.current;
    }, [selected.current]);

    const [ px, py ] = coordToPixel(vert.x, vert.y, zoom, pan);

    return (
        <View
            style={{
                position: 'absolute',
                left: px,
                top: py,
                zIndex: 1,
                cursor: 'pointer',
                // opacity: 0.2
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