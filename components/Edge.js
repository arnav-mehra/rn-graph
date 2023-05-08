import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Line, Polygon } from 'react-native-svg';

import {
    coordToPixel,
    getTriangleCoordStr
} from '../util';
import CenteredView from './CenteredView';


const Edge = ({
    edge,
    style,
    from,
    fromStyle,
    to,
    toStyle,
    zoom,
    pan,
}) => {    
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

    // a precomputed values for triangle positioning & angling.
    const toVal = (toStyle.size + style.arrow.size) / (2 * d);
    const fromVal = (fromStyle.size + style.arrow.size) / (2 * d);
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
                            color: style.label.color,
                            fontSize: style.label.size,
                            fontWeight: style.label.weight,
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
                    stroke={style.line.color}
                    strokeWidth={style.line.width}
                />
            </Svg>

            {/* Directed edge triangle */}
            {edge.directed && (
                <CenteredView
                    left={ipx - toVal * dx}
                    top={ipy - toVal * dy}
                    angle={angle}
                >
                    <Svg
                        style={{
                            width: style.arrow.size,
                            height: style.arrow.size,
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(style.arrow.size)}
                            fill={style.arrow.fill}
                            stroke={style.arrow.color}
                            strokeWidth={style.arrow.width}
                        />
                    </Svg>
                </CenteredView>
            )}
            
            {/* Bidirectional edge 2nd triangle */}
            {edge.directed === 2 && (
                <CenteredView
                    left={fpx + fromVal * dx}
                    top={fpy + fromVal * dy}
                    angle={angle + 180}
                >
                    <Svg
                        style={{
                            width: style.arrow.size,
                            height: style.arrow.size
                        }}
                    >
                        <Polygon
                            points={getTriangleCoordStr(style.arrow.size)}
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