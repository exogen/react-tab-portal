import { useMemo, useRef } from "react";

export default function useTabPortal() {
  const contentRef = useRef();
  const portalRef = useRef();
  return useMemo(() => ({ contentRef, portalRef }), []);
}
