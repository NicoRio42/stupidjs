const extractAttributeNameFromString = (str: string): string => {
  const stringArray = str.split(" ");
  const lastString = stringArray[stringArray.length - 1];

  return lastString.slice(0, lastString.length - 1);
};

export default extractAttributeNameFromString;
