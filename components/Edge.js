import React from 'react'
import { View } from 'react-native'

import { coordToPixel, scalarToPixelDelta } from '../util';

const Line = ({
    from,
    to,
    edge
}) => {
    if (!from || !to) return null;
    
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    return (
        <View
            style={{
                position: 'absolute',
                left: coordToPixel((from.x + to.x) / 2),
                top: coordToPixel((from.y + to.y) / 2)
            }}
        >
            <View
                style={{
                    width: scalarToPixelDelta(d),
                    height: 1,
                    backgroundColor: 'black',
                    marginLeft: '-50%',
                    transform: [
                        {
                            rotate: `${Math.atan2(dy, dx) * 180 / Math.PI}deg`
                        }
                    ],
                }}
            />
        </View>
    )
}

export default Line