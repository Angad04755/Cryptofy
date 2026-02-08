export function Debounce(fn: any, delay: number) {
    let timer: any;

    return function (value: any) {
        clearTimeout(timer);
        return timer = setTimeout(() => {
            fn(value)
        }, delay)
    }
}