import React, { useCallback, useContext, useMemo, useRef } from "react";
import useTabPortal from "./useTabPortal";
import { getTabbableNodes, focusBefore, focusAfter } from "./utils";

const hiddenFocusableStyle = {
  position: "absolute",
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none",
  zIndex: -1
};

const Context = React.createContext();

function Portal({ children, to: tabPortal }) {
  const context = useContext(Context);

  if (!tabPortal) {
    tabPortal = context;
  }

  const { contentRef, portalRef } = tabPortal;

  const handleFocus = useCallback(
    event => {
      event.stopPropagation();
      const contentNode = contentRef.current;
      if (contentNode) {
        const tabItems = getTabbableNodes(contentNode);
        if (tabItems.length > 2) {
          tabItems[1].focus();
          return;
        }
      }
      event.currentTarget.blur();
    },
    [contentRef]
  );

  return (
    <span
      tabIndex={0}
      ref={portalRef}
      style={hiddenFocusableStyle}
      onFocus={handleFocus}
    />
  );
}

Portal.displayName = "TabPortal.Portal";

const Content = React.forwardRef(
  ({ as: ElementType = "div", children, from: tabPortal }, inputRef) => {
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
          focused = focusBefore(headRef.current);
        } else if (
          event.relatedTarget &&
          contentNode.contains(event.relatedTarget)
        ) {
          // If focus moved here from inside the content, we're
          // moving backwards and should thus move focus back to the
          // last tabbable element before the portal.
          focused = focusBefore(portalRef.current);
        } else {
          // Otherwise, it means we've tabbed forward from the last
          // element before the content, and we should skip to the
          // first tabbable element after the portal.
          focused = focusAfter(tailRef.current);
        }
        if (!focused) {
          event.currentTarget.blur();
          document.body.focus();
        }
      },
      [contentRef, portalRef]
    );

    const handleFocusTail = useCallback(
      event => {
        event.stopPropagation();
        if (
          event.relatedTarget &&
          event.currentTarget.compareDocumentPosition(event.relatedTarget) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ) {
          // If focus moved here from after this element in the
          // document order, we're moving backwards and should thus
          // skip to the last tabbable element before the portal.
          headRef.current.focus();
        } else {
          // Otherwise, it means we've tabbed forward from inside
          // the content, and we should move focus back to the first
          // tabbable element after the portal.
          const focused = focusAfter(portalRef.current);
          if (!focused) {
            event.currentTarget.blur();
            document.body.focus();
          }
        }
      },
      [portalRef]
    );

    const ref = useCallback(
      node => {
        contentRef.current = node;
        if (typeof inputRef === "function") {
          inputRef(node);
        } else if (inputRef) {
          inputRef.current = node;
        }
      },
      [inputRef, contentRef]
    );

    return (
      <ElementType ref={ref}>
        <span
          // The "head" focusable item inside the portal. It serves to
          // capture when focus moves to the beginning of the portal, which
          // means the user has either tabbed forward to it from the previous
          // element, or tabbed backward from an element inside the portal.
          ref={headRef}
          tabIndex={0}
          style={hiddenFocusableStyle}
          onFocus={handleFocusHead}
        />
        {children}
        <span
          ref={tailRef}
          tabIndex={0}
          style={hiddenFocusableStyle}
          onFocus={handleFocusTail}
        />
      </ElementType>
    );
  }
);

Content.displayName = "TabPortal.Content";

function TabPortal({ children }) {
  const value = useTabPortal();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

TabPortal.Portal = Portal;
TabPortal.Content = Content;

export default TabPortal;
