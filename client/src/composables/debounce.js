class Debounce {
  static timeoutId = null;

  static saveDebounce(debounce_time, callback) {
    this.timeoutId = setTimeout(() => {
      callback();
    }, debounce_time);
  }

  static cancelDebounce() {
    clearTimeout(this.timeoutId);
  }
}

export { Debounce };
