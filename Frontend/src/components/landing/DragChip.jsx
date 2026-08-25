import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

/** Physics-based draggable chip — demonstrates react-spring bounce + drag */
export default function DragChip({ children, className = '' }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        immediate: down,
        config: { tension: 300, friction: 12, mass: 0.8 },
      });
    },
    { filterTaps: true }
  );

  return (
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: 'none' }}
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {children}
    </animated.div>
  );
}
