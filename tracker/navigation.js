// Detects page changes in single-page apps.
// They change the URL with history.pushState/replaceState, which fires
// no event, so both are wrapped to call onChange after they run.
export function watchNavigation(onChange) {
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      onChange();
      return result;
    };
  }
  window.addEventListener("popstate", onChange);
}
