/**
 *
 * @param {string} str
 */
const extractAttributeNameFromString = (str) => {
  const stringArray = str.split(" ");
  const lastString = stringArray[stringArray.length - 1];

  return lastString.slice(0, lastString.length - 1);
};

export default extractAttributeNameFromString;
