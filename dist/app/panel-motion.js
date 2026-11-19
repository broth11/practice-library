let activeTransition;

// Keep outgoing panels available until their exit animation finishes.
// Network requests happen before this helper so loading never freezes the page.
export function transitionPanels(update, afterTransition) {
  activeTransition?.skipTransition();
  activeTransition = undefined;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const result = update();
    afterTransition?.();
    return result;
  }
  const transition = document.startViewTransition(update);
  activeTransition = transition;
  transition.ready.catch(() => {});
  transition.finished.then(() => {
    // A newer interaction may have replaced this transition and its target.
    if (activeTransition === transition) afterTransition?.();
  }).catch(() => {}).finally(() => {
    if (activeTransition === transition) activeTransition = undefined;
  });
  return transition.updateCallbackDone;
}
