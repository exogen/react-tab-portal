import React, { useCallback, useContext, useRef } from 'react';
import HiddenTabbable from './HiddenTabbable';
import useTabPortal from './useTabPortal';
import {
  getTabbableNodes,
  focusBefore,
  focusAfter,
  didMoveBackward
} from './utils';

const Context = React.createContext();

function Portal({ to: tabPortal, ...rest }) {
  const context = useContext(Context);

  if (!tabPortal) {
    tabPortal = context;
  }

  const { contentRef, portalRef } = tabPortal;

  const handleFocus = useCallback(
    event => {
      event.stopPropagation();
      let focused = false;
      const contentNode = contentRef.current;
      if (contentNode) {
        const tabItems = getTabbableNodes(contentNode);
        const isMovingBackward = didMoveBackward(
          event.currentTarget,
          event.relatedTarget
        );
        if (tabItems.length > 2) {
          const focusIndex = isMovingBackward ? tabItems.length - 2 : 1;
          tabItems[focusIndex].focus();
          focused = true;
        } else {
          if (isMovingBackward) {
            focused = focusBefore(portalRef.current);
          } else {
            focused = focusAfter(portalRef.current);
          }
        }
      }
      if (!focused) {
        event.currentTarget.blur();
      }
    },
    [contentRef, portalRef]
  );

  return <HiddenTabbable {...rest} ref={portalRef} onFocus={handleFocus} />;
}

Portal.displayName = 'TabPortal.Portal';

const Content = React.forwardRef(
  (
    {
      as: ElementType = 'div',
      children,
      from: tabPortal,
      hiddenTabbableAs,
      ...rest
    },
    inputRef
  ) => {
    const headRef = useRef();
    const tailRef = useRef();
    const context = useContext(Context);

    if (!tabPortal) {
      tabPortal = context;
    }

    const { contentRef, portalRef } = tabPortal;

    const handleFocusHead = useCallback(
      event => {
        event.stopPropagation();
        let focused = false;

        const contentNode = contentRef.current;
        if (event.relatedTarget === tailRef.current) {
          // FIXME: I can't remember the motivation for adding this particular
          // branch. It made sense at the time.
          focused = focusBefore(headRef.current);
        } else if (
          event.relatedTarget &&
          contentNode.contains(event.relatedTarget)
        ) {
          // If focus moved here from inside the content, we're moving backward
          // and should thus move focus back to the last tabbable element before
          // the portal.
          focused = focusBefore(portalRef.current);
        } else {
          // Otherwise, it means we've tabbed forward from the last element
          // before the content, and we should skip to the first tabbable
          // element after the content.
          focused = focusAfter(tailRef.current);
        }
        if (!focused) {
          event.currentTarget.blur();
        }
      },
      [contentRef, portalRef]
    );

    const handleFocusTail = useCallback(
      event => {
        event.stopPropagation();
        let focused = false;

        if (didMoveBackward(event.currentTarget, event.relatedTarget)) {
          // If focus moved here from after this element in the document order,
          // we're moving backward and should thus skip to the last tabbable
          // element before the content.
          focused = focusBefore(headRef.current);
        } else {
          // Otherwise, it means we've tabbed forward from inside the content,
          // and we should move focus back to the first tabbable element after
          // the portal.
          focused = focusAfter(portalRef.current);
        }
        if (!focused) {
          event.currentTarget.blur();
        }
      },
      [portalRef]
    );

    const ref = useCallback(
      node => {
        contentRef.current = node;
        if (typeof inputRef === 'function') {
          inputRef(node);
        } else if (inputRef) {
          inputRef.current = node;
        }
      },
      [inputRef, contentRef]
    );

    return (
      <ElementType ref={ref} {...rest}>
        <HiddenTabbable
          // The "head" focusable item inside the content. It serves to
          // capture when focus moves to the beginning of the content, which
          // means the user has either tabbed forward to it from the previous
          // element in document order, or tabbed backward from an element
          // inside the content (like something in `children`, or the "tail").
          as={hiddenTabbableAs}
          ref={headRef}
          onFocus={handleFocusHead}
        />
        {children}
        <HiddenTabbable
          // The "tail" focusable item inside the content. It serves to
          // capture when focus has reached the end of the content, which
          // means the user has either tabbed backward to it from the next
          // element in document order, or tabbed forward to it from an element
          // inside the content (like something in `children`, or the "head").
          as={hiddenTabbableAs}
          ref={tailRef}
          onFocus={handleFocusTail}
        />
      </ElementType>
    );
  }
);

Content.displayName = 'TabPortal.Content';

function TabPortal({ children }) {
  const value = useTabPortal();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

TabPortal.Portal = Portal;
TabPortal.Content = Content;

export default TabPortal;
