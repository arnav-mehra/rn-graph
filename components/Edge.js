import React from 'react';
import { View } from 'react-native';
import { Svg, Line, Polygon } from 'react-native-svg';

import {
    coordToPixel,
    getTriangleCoordStr
} from '../util';


const Edge = ({
    from,
    to,
    edge,
    zoom,
    pan,
    style
}) => {
    // invalid vertex, don't render.
    if (!from || !to) return null;
    
    // calculate edge length.
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    
    // calculate initial & final pixel coords.
    const [ ipx, ipy ] = coordToPixel(
        from.x, from.y, zoom, pan
    );
    const [ fpx, fpy ] = coordToPixel(
        to.x, to.y, zoom, pan
    );
    
    // edge styles.
    const lineStyle = style.edges.line;
    const arrowStyle = style.edges.arrow;

    // a precomputed value for triangle positioning.
    const pVal = (style.vertices.size + arrowStyle.size) / (2 * d);

    // render edge.
    return (
        <>
            {/* Edge line */}
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
                    stroke={lineStyle.color}
                    strokeWidth={lineStyle.width}
                />
            </Svg>

            {/* Directed edge */}
            {edge.directed && (
                <View
                    style={{
                        position: 'absolute',
                        overflow: 'visible',
                        left: ipx - pVal * dx,
                        top: ipy - pVal * dy
                    }}
                >
                    <Svg
                        style={{
                            width: arrowStyle.size,
                            height: arrowStyle.size,
                            transform: [{
                                rotate: `${Math.atan2(dy, dx) * 180 / Math.PI}deg`
                            }],
                            marginTop: -arrowStyle.size / 2,
                            marginLeft: -arrowStyle.size / 2
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(arrowStyle.size)}
                            fill={arrowStyle.fill}
                            stroke={arrowStyle.color}
                            strokeWidth={arrowStyle.width}
                        />
                    </Svg>
                </View>
            )}
            
            {/* Bidirectional edge */}
            {edge.directed === 2 && (
                <View
                    style={{
                        position: 'absolute',
                        overflow: 'visible',
                        left: fpx + pVal * dx,
                        top: fpy + pVal * dy
                    }}
                >
                    <Svg
                        style={{
                            width: arrowStyle.size,
                            height: arrowStyle.size,
                            transform: [{
                                rotate: `${Math.atan2(dy, dx) * 180 / Math.PI + 180}deg`
                            }],
                            marginTop: -arrowStyle.size / 2,
                            marginLeft: -arrowStyle.size / 2
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(arrowStyle.size)}
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