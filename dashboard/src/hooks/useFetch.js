import { useEffect, useRef, useState } from "react";

export function useFetch(load, key) {
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let active = true;
    loadRef.current()
      .then((data) => {
        if (active) setResult({ key, data, error: null });
      })
      .catch((err) => {
        if (active) setResult({ key, data: null, error: err.message });
      });
    return () => {
      active = false;
    };
  }, [key]);

  if (result.key !== key) {
    return { data: null, error: null, loading: true };
  }
  return { data: result.data, error: result.error, loading: false };
}
