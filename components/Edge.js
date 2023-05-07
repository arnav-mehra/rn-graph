import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Line, Polygon } from 'react-native-svg';

import {
    coordToPixel,
    getTriangleCoordStr
} from '../util';
import CenteredView from './CenteredView';


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
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const absAngle = (angle + 360) % 360;
    const uprightAngle = (absAngle > 90 && absAngle < 270) ? angle + 180 : angle;

    // render edge.
    return (
        <>
            {/* Edge label */}
            {edge.label && (
                <CenteredView
                    left={(ipx + fpx) / 2}
                    top={(ipy + fpy) / 2}
                    angle={uprightAngle}
                >
                    <Text
                        style={{
                            color: style.edges.label.color,
                            fontSize: style.edges.label.size,
                            fontWeight: style.edges.label.weight,
                            paddingBottom: '50%'
                        }}
                    >
                        {edge.label}
                    </Text>
                </CenteredView>
            )}
            
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

            {/* Directed edge triangle */}
            {edge.directed && (
                <CenteredView
                    left={ipx - pVal * dx}
                    top={ipy - pVal * dy}
                    angle={angle}
                >
                    <Svg
                        style={{
                            width: arrowStyle.size,
                            height: arrowStyle.size,
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(arrowStyle.size)}
                            fill={arrowStyle.fill}
                            stroke={arrowStyle.color}
                            strokeWidth={arrowStyle.width}
                        />
                    </Svg>
                </CenteredView>
            )}
            
            {/* Bidirectional edge 2nd triangle */}
            {edge.directed === 2 && (
                <CenteredView
                    left={fpx + pVal * dx}
                    top={fpy + pVal * dy}
                    angle={angle + 180}
                >
                    <Svg
                        style={{
                            width: arrowStyle.size,
                            height: arrowStyle.size
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(arrowStyle.size)}
                            fill="white"
                            stroke="black"
                            strokeWidth="2"
                        />
                    </Svg>
                </CenteredView>
            )}
        </>
    )
}

export default Edge