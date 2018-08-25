const timeToDecimal = (t) => {
  const arr = t.split(':');
  const arr2 = arr[1].split(' ');
  const time = [arr[0], arr2[0]];
  const dec = parseInt((time[1] / 6) * 10, 10);
  return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec);
}
export default timeToDecimal;