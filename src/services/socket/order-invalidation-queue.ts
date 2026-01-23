type FlushCallback = (orderIds: string[]) => void;

class OrderInvalidationQueue {
  private staleOrderIds = new Set<string>();
  private debounceTimer: NodeJS.Timeout | null = null;
  private debounceMs = 400; // Tuned for production (300-500ms range)
  private flushCallback: FlushCallback | null = null;

  /**
   * Mark an order as stale (from newOrder or updateOrder event)
   */
  invalidate(orderId: string): void {
    this.staleOrderIds.add(orderId);
    this.resetDebounceTimer();
  }

  /**
   * Mark multiple orders as stale
   */
  invalidateBatch(orderIds: string[]): void {
    orderIds.forEach((id) => this.staleOrderIds.add(id));
    this.resetDebounceTimer();
  }

  /**
   * Register callback for when queue flushes
   */
  onFlush(callback: FlushCallback): void {
    this.flushCallback = callback;
  }

  /**
   * Reset debounce timer (back-pressure mechanism)
   */
  private resetDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flush();
    }, this.debounceMs);
  }

  /**
   * Flush queue and trigger batch fetch
   */
  private flush(): void {
    if (this.staleOrderIds.size === 0) {
      return;
    }

    // Snapshot and clear
    const orderIds = Array.from(this.staleOrderIds);
    this.staleOrderIds.clear();

    // Trigger batch fetch
    if (this.flushCallback) {
      this.flushCallback(orderIds);
    }
  }

  /**
   * Clear queue (cleanup)
   */
  clear(): void {
    this.staleOrderIds.clear();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Get queue size (debugging)
   */
  getQueueSize(): number {
    return this.staleOrderIds.size;
  }

  /**
   * Tune debounce (production adjustment)
   */
  setDebounceMs(ms: number): void {
    this.debounceMs = ms;
  }
}

// Singleton instance
export const orderInvalidationQueue = new OrderInvalidationQueue();
