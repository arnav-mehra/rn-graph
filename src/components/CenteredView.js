import React from 'react';
import { View } from 'react-native';

const CenteredView = ({
    left,
    top,
    angle = 0,
    children,
    ...otherProps
}) => {
    return (
        <View
            style={{
                position: 'absolute',
                left: left,
                top: top,
                zIndex: 1,
                cursor: 'pointer',
                userSelect: 'none',
                transform: [
                    { translate: '-50%, -50%' },
                    { rotate: `${angle}deg` }
                ]
            }}
            {...otherProps}
        >
            {children}
        </View>
    )
};

export default CenteredView;