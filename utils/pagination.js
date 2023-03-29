const convertDataToPagination = (oldDate, perChuck) => {
  const result = oldDate.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChuck);

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
};

module.exports = { convertDataToPagination };
