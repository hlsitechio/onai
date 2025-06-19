
/**
 * Error aggregation and counting utilities
 */
export class ErrorAggregation {
  private errorCounts = new Map<string, number>();

  getErrorKey(message: string): string {
    // Create a normalized key for error aggregation
    return message
      .replace(/\d+/g, '[NUMBER]') // Replace numbers
      .replace(/https?:\/\/[^\s]+/g, '[URL]') // Replace URLs
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, '[UUID]') // Replace UUIDs
      .replace(/blob:[^\s]+/g, '[BLOB_URL]') // Replace blob URLs
      .substring(0, 100); // Limit length
  }

  shouldLogError(message: string, maxOccurrences: number = 3): { shouldLog: boolean; count: number } {
    const errorKey = this.getErrorKey(message);
    const count = this.errorCounts.get(errorKey) || 0;
    const newCount = count + 1;
    this.errorCounts.set(errorKey, newCount);

    return {
      shouldLog: newCount <= maxOccurrences,
      count: newCount
    };
  }

  shouldLogWarning(message: string, maxOccurrences: number = 5): { shouldLog: boolean; count: number } {
    return this.shouldLogError(message, maxOccurrences);
  }

  getErrorStats() {
    return {
      totalErrors: Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0),
      uniqueErrors: this.errorCounts.size,
      topErrors: Array.from(this.errorCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    };
  }

  resetErrorCounts() {
    this.errorCounts.clear();
  }
}
