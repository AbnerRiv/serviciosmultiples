type DebounceCallback = (...args: any[]) => void;

export function debounce(callback: DebounceCallback, delay: number) {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let shouldCallImmediately = false;

    const debouncedFunction = function (this: any, ...args: any[]) {
        if (timerId) {
            clearTimeout(timerId);
        }
        if (shouldCallImmediately) {
            callback.apply(this, args);
            shouldCallImmediately = false; // Reset flag
        } else {
            timerId = setTimeout(() => {
                callback.apply(this, args);
            }, delay);
        }
    };

    debouncedFunction.flush = () => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        shouldCallImmediately = false; // Call immediately on next invocation
    };

    return debouncedFunction;
}