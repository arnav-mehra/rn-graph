import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { coordToPixel, pixelToCoord } from '../util';


const Vertex = ({
    v,
    zoom,
    pan
}) => {
    const selected = useRef(false);
    const [ vert, setVert ] = useState(v);
    const [ px, py ] = coordToPixel(vert.x, vert.y, zoom, pan);

    const handleMouseMove = useRef((e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (!selected) return;
        const [ x, y ] = pixelToCoord(e.clientX, e.clientY, zoom, pan);
        vert.x = x;
        vert.y = y;
        setVert(vert);
    });

    useEffect(() => {
        vert.fixed = selected.current;
        if (selected.current) {
            addEventListener('mousemove', handleMouseMove.current)
        } else {
            removeEventListener('mousemove', handleMouseMove.current);
        }
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
            onMouseDown={() => selected.current = true}
            onMouseUp={() => selected.current = false}
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
}

export default Vertex