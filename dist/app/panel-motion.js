let activeTransition;

// Keep outgoing panels available until their exit animation finishes.
// Network requests happen before this helper so loading never freezes the page.
export function transitionPanels(update) {
  activeTransition?.skipTransition();
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return update();
  }
  const transition = document.startViewTransition(update);
  activeTransition = transition;
  transition.ready.catch(() => {});
  transition.finished.catch(() => {}).finally(() => {
    if (activeTransition === transition) activeTransition = undefined;
  });
  return transition.updateCallbackDone;
}
