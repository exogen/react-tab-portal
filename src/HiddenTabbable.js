import React from 'react';

export const hiddenTabbableStyle = {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none',
  zIndex: -1
};

const HiddenTabbable = React.forwardRef(
  ({ as: ElementType = 'span', ...rest }, ref) => {
    return (
      <ElementType
        ref={ref}
        tabIndex={0}
        style={hiddenTabbableStyle}
        {...rest}
      />
    );
  }
);

HiddenTabbable.displayName = 'HiddenTabbable';

export default HiddenTabbable;
