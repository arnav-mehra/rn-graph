import React, { useEffect, useRef } from 'react';

const useMoveSelected = (onMouseMove) => {
    const selected = useRef(false);

    const handleMouseMove = useRef((e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (!selected?.current) return;
        onMouseMove(e);
    });

    useEffect(() => {
        if (selected.current) {
            addEventListener('mousemove', handleMouseMove.current);
        } else {
            removeEventListener('mousemove', handleMouseMove.current);
        }
        return () => {
            removeEventListener('mousemove', handleMouseMove.current);
        }
    }, [selected.current]);

    return {
        wrapperProps: {
            onMouseDown: (e) => {
                e.stopPropagation();
                selected.current = true;
            },
            onMouseUp: (e) => {
                e.stopPropagation();
                selected.current = false;
            }
        },
        selected
    };
};

export default useMoveSelected;