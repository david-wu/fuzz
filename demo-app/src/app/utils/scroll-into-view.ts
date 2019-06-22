
export function scrollIntoView(parentEl, targetEl) {
  const parentRect = parentEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const relativeRect = {
    top: targetRect.top - parentRect.top,
    left: targetRect.left - parentRect.left,
  };


  // no need to scroll if the entire target is already visible
  const isTargetInView = (relativeRect.top >= 0) && ((parentRect.bottom - targetRect.bottom) >= 0);
  if (isTargetInView) {
    return;
  }

  const targetMidpoint = relativeRect.top + (0.5 * targetRect.height);
  const isTargetCloserToTop = targetMidpoint < (0.5 * parentRect.height);
  const stickyFactor = isTargetCloserToTop ? 0 : (targetRect.height - parentRect.height);

  const targetY = parentEl.scrollTop + relativeRect.top + stickyFactor;
  parentEl.scroll(parentEl.scrollLeft, targetY);
}
