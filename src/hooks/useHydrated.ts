import { useState, useEffect } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to gate rendering of content that depends on persisted
 * Zustand stores (localStorage) to avoid SSR hydration mismatches.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}
