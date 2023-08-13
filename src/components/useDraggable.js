import React, { useEffect, useRef } from 'react';

const useDraggable = (
    onMouseMove = () => {},
    deps = []
) => {
    const selected = useRef(false);

    const handleMouseMove = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (!selected?.current) return;
        onMouseMove(e, deps);
    }

    // save function to ref to for event listener binding.
    const handleMouseMoveRef = useRef(handleMouseMove);

    // handle dependency changes.
    useEffect(() => {
        removeEventListener('mousemove', handleMouseMoveRef.current);
        handleMouseMoveRef.current = handleMouseMove;
        if (selected.current) {
            addEventListener('mousemove', handleMouseMoveRef.current);
        }
    }, deps);

    // toggle event listener on selection.
    useEffect(() => {
        if (selected.current) {
            addEventListener('mousemove', handleMouseMoveRef.current);
        } else {
            removeEventListener('mousemove', handleMouseMoveRef.current);
        }
        return () => {
            removeEventListener('mousemove', handleMouseMoveRef.current);
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

export default useDraggable;