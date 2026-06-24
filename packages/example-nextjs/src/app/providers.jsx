"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { getStore } from "../lib/firedux";

export function FireduxProvider({ children }) {
  const storeRef = useRef(getStore());
  return <Provider store={storeRef.current}>{children}</Provider>;
}
