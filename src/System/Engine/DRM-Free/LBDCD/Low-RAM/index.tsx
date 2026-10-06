/**
 * System/Engine/DRM-Free/LBDCD/Low-RAM Module
 * High-performance, aggressive garbage-disposal buffers, object pool registers, and frame recycling.
 * Ensures compatibility with extremely limited RAM (e.g. 1MB/2MB hardware constraints, or vintage DOS machines).
 */

export class FrameBufferRecycler<T> {
  private pool: T[] = [];
  private activeLimit: number;

  constructor(limit = 10) {
    this.activeLimit = limit;
  }

  /**
   * Retrieves an item from the pool or creates a new one to save garbage collector sweeps.
   */
  public allocate(creator: () => T): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return creator();
  }

  /**
   * Recycles an object back into the pool instead of deallocating.
   */
  public recycle(item: T): void {
    if (this.pool.length < this.activeLimit) {
      this.pool.push(item);
    }
  }

  public clearPool(): void {
    this.pool = [];
  }
}

export default {
  FrameBufferRecycler,
};
