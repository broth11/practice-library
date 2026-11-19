// Two sequential phases share one clock and cancellation signal. Native smooth
// scrolling has browser-dependent timing, so drive both phase durations explicitly.
const MOVE_DURATION = 600;
const REVEAL_DURATION = 500;
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
  // Retain the previous grid during the slide so collapsing it cannot move
  // the clicked heading before its animation begins.
  if (retiringGroup) {
    retiringGroup.classList.add('lesson-open');
    retiringGroup.querySelector('[data-lesson]').setAttribute('aria-expanded', 'true');
    retiringDots.inert = true;
  }
  const retire = () => {
    retiringGroup?.classList.remove('lesson-open');
    retiringGroup?.querySelector('[data-lesson]').setAttribute('aria-expanded', 'false');
    if (retiringDots) retiringDots.inert = retiringInert;
  };
  dots.inert = true;
  dots.style.overflow = 'hidden';
  const reveal = progress => {
    dots.style.height = `${height * progress}px`;
    dots.style.paddingTop = `${paddingTop * progress}px`;
    dots.style.paddingBottom = `${paddingBottom * progress}px`;
    dots.style.opacity = String(progress);
  };
  try {
    reveal(0);
    reserveSpace(pane);
    const target = targetTop();
    // Rebuilding the list closes the previous lesson. Preserve the clicked
    // heading's screen position before starting its upward movement.
    pane.scrollTop = Math.max(0, target - startOffset);
    const from = pane.scrollTop;
    if (!await animateProgress(reducedMotion ? 0 : MOVE_DURATION, progress => {
      pane.scrollTop = from + (target - from) * progress;
    }, signal)) return false;
    retire();
    reserveSpace(pane);
    pane.scrollTop = targetTop();
    if (!await animateProgress(reducedMotion ? 0 : REVEAL_DURATION, reveal, signal)) return false;
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
