let actionCount = 0;
let lastShownAt = 0;

const THRESHOLD = 6;
const COOLDOWN = 1000 * 60 * 2;

export function trackAction(weight = 1) {
  actionCount += weight;
}

export function shouldShowPaywall() {
  const now = Date.now();

  if (now - lastShownAt < COOLDOWN) return false;

  if (actionCount >= THRESHOLD) {
    lastShownAt = now;
    actionCount = 0;
    return true;
  }

  return false;
}

export function resetTrigger() {
  actionCount = 0;
}