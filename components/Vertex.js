import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { coordToPixel, pixelToCoord } from '../util';


const Vertex = ({v}) => {
    const selected = useRef(false);
    const [ vert, setVert ] = useState(v);

    const handleMouseMove = useRef((e) => {
        if (!selected) return;
        vert.x = pixelToCoord(e.clientX);
        vert.y = pixelToCoord(e.clientY);
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
                left: coordToPixel(vert.x),
                top: coordToPixel(vert.y),
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