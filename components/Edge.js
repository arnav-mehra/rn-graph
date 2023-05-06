import React from 'react'
import { Svg, Line, Polygon } from 'react-native-svg'
import { View, Text } from 'react-native';
import { TRIANGLE_SIZE, coordToPixel, coordToPixelDelta, triangleCoordStr } from '../util';

const Edge = ({
    from,
    to,
    edge,
    zoom,
    pan
}) => {
    if (!from || !to) return null;
    
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    
    const [ ipx, ipy ] = coordToPixel(
        from.x, from.y, zoom, pan
    );
    const [ fpx, fpy ] = coordToPixel(
        to.x, to.y, zoom, pan
    );
    
    // console.log({dx,dy,d})

    return (
        <>
            <Svg
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    overflow: 'hidden'
                }}
            >
                <Line
                    x1={ipx}
                    y1={ipy}
                    x2={fpx}
                    y2={fpy}
                    stroke="black"
                    strokeWidth="2"
                />
            </Svg>

            {edge.directed && (
                <View
                    style={{
                        position: 'absolute',
                        overflow: 'visible',
                        left: ipx - (30 + TRIANGLE_SIZE / 2) * (dx / d),
                        top: ipy - (30 + TRIANGLE_SIZE / 2) * (dy / d)
                    }}
                >
                    <Svg
                        style={{
                            width: TRIANGLE_SIZE,
                            height: TRIANGLE_SIZE,
                            transform: [{
                                rotate: `${Math.atan2(dy, dx) * 180 / Math.PI}deg`
                            }],
                            marginTop: -TRIANGLE_SIZE / 2,
                            marginLeft: -TRIANGLE_SIZE / 2
                        }}
                    >
                        <Polygon
                            points={triangleCoordStr}
                            fill="white"
                            stroke="black"
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            )}
            
            {edge.directed === 2 && (
                <View
                    style={{
                        position: 'absolute',
                        overflow: 'visible',
                        left: fpx + (30 + TRIANGLE_SIZE / 2) * (dx / d),
                        top: fpy + (30 + TRIANGLE_SIZE / 2) * (dy / d)
                    }}
                >
                    <Svg
                        style={{
                            width: TRIANGLE_SIZE,
                            height: TRIANGLE_SIZE,
                            transform: [{
                                rotate: `${Math.atan2(dy, dx) * 180 / Math.PI + 180}deg`
                            }],
                            marginTop: -TRIANGLE_SIZE / 2,
                            marginLeft: -TRIANGLE_SIZE / 2
                        }}
                    >
                        <Polygon
                            points={triangleCoordStr}
                            fill="white"
                            stroke="black"
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            )}
        </>
    )
}

export default Edge