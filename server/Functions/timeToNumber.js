const timeToNumber = (t) => {
    t.split('.');
    const arr = t.split(':');
    const time = parseInt(arr[0], 10);
    return time;
}
export default timeToNumber;