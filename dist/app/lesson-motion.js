// Moving the lesson and revealing its buttons share one 600ms timeline.
// Drive scrolling explicitly so it stays synchronized with the changing grid.
const DURATION = 600;
const ease = t => t * t * (3 - 2 * t);

function animateProgress(duration, update, signal) {
  if (signal.aborted) return Promise.resolve(false);
  if (!duration) { update(1); return Promise.resolve(true); }
  return new Promise(resolve => {
    const start = performance.now();
    let frame;
    const finish = completed => {
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', cancel);
      resolve(completed);
    };
    const cancel = () => finish(false);
    const tick = now => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      update(ease(progress));
      if (progress === 1) finish(true);
      else frame = requestAnimationFrame(tick);
    };
    signal.addEventListener('abort', cancel, { once: true });
    update(0);
    frame = requestAnimationFrame(tick);
  });
}

export async function animateLesson({ pane, group, retiringGroup, startOffset, reserveSpace, signal, reducedMotion = false }) {
  const dots = group.querySelector('.question-dots');
  const originalStyle = dots.style.cssText;
  const originalInert = dots.inert;
  const height = dots.getBoundingClientRect().height;
  const styles = getComputedStyle(dots);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  const targetTop = () => pane.scrollTop + group.getBoundingClientRect().top - pane.getBoundingClientRect().top;
  const retiringDots = retiringGroup?.querySelector('.question-dots');
  const retiringInert = retiringDots?.inert;
  const retiringStyle = retiringDots?.style.cssText;
  // Start from the previous grid's visible size, then close it on the same
  // timeline. Its changing height is included in the scroll target each frame.
  if (retiringGroup) {
    retiringGroup.classList.add('lesson-open');
    retiringGroup.querySelector('[data-lesson]').setAttribute('aria-expanded', 'true');
    retiringDots.inert = true;
    retiringDots.style.overflow = 'hidden';
  }
  const retiringHeight = retiringDots?.getBoundingClientRect().height;
  const retiringStyles = retiringDots ? getComputedStyle(retiringDots) : null;
  const retiringPaddingTop = parseFloat(retiringStyles?.paddingTop ?? '0');
  const retiringPaddingBottom = parseFloat(retiringStyles?.paddingBottom ?? '0');
  const retire = () => {
    retiringGroup?.classList.remove('lesson-open');
    retiringGroup?.querySelector('[data-lesson]').setAttribute('aria-expanded', 'false');
    if (retiringDots) {
      retiringDots.style.cssText = retiringStyle;
      retiringDots.inert = retiringInert;
    }
  };
  dots.inert = true;
  dots.style.overflow = 'hidden';
  const reveal = progress => {
    dots.style.height = `${height * progress}px`;
    dots.style.paddingTop = `${paddingTop * progress}px`;
    dots.style.paddingBottom = `${paddingBottom * progress}px`;
    dots.style.opacity = String(progress);
    if (retiringDots) {
      const remaining = 1 - progress;
      retiringDots.style.height = `${retiringHeight * remaining}px`;
      retiringDots.style.paddingTop = `${retiringPaddingTop * remaining}px`;
      retiringDots.style.paddingBottom = `${retiringPaddingBottom * remaining}px`;
      retiringDots.style.opacity = String(remaining);
    }
  };
  try {
    reveal(0);
    reserveSpace(pane);
    const target = targetTop();
    // Rebuilding the list closes the previous lesson. Preserve the clicked
    // heading's screen position before starting its upward movement.
    pane.scrollTop = Math.max(0, target - startOffset);
    const from = pane.scrollTop;
    if (!await animateProgress(reducedMotion ? 0 : DURATION, progress => {
      reveal(progress);
      reserveSpace(pane);
      pane.scrollTop = from + (targetTop() - from) * progress;
    }, signal)) return false;
    return true;
  } finally {
    retire();
    dots.style.cssText = originalStyle;
    dots.inert = originalInert;
    if (!signal.aborted && pane.isConnected) {
      reserveSpace(pane);
      pane.scrollTop = targetTop();
    }
  }
}
