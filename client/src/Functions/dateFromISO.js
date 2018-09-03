const getDateISO = (data) => {
  const split = JSON.stringify(data);
  const dbDate = split.split(':');
  const splitDate = dbDate[0].split('-');
  const dayCreated = splitDate[2].split('T');
  const removed = splitDate[0].split('"');
  const dates = splitDate[1] + ' ' + dayCreated[0] + ' ' + removed[1];
  return dates;
}

export default getDateISO;


