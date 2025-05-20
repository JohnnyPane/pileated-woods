import pluralize from "pluralize";

const productTypeMap = {
  'LiveEdgeSlab': 'Live Edge Slab',
}

export const humanizeProductType = (productType) => {
  if (productTypeMap[productType]) {
    return productTypeMap[productType];
  }
  return productType.replace(/([A-Z])/g, ' $1').trim();
}

export const pluralizeRailsModel = (modelName) => {
  return pluralize.plural(modelName);p
}

export const moneyDisplay = (amount) => {
  if (amount === null || amount === undefined) {
    return "$0.00";
  }
  return `$${(amount / 100).toFixed(2)}`;
}

export const humanizeRailsDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}