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
  return pluralize.plural(modelName);
}