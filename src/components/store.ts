export const store = {
  progress: 0,
  listeners: new Set<(progress: number) => void>(),
  setProgress(p: number) {
    this.progress = p;
    this.listeners.forEach(l => l(p));
  },
  subscribe(listener: (progress: number) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};
