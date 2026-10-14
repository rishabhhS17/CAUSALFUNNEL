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
