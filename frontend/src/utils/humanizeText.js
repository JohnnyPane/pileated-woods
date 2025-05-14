const productTypeMap = {
  'LiveEdgeSlab': 'Live Edge Slab',
}

export const humanizeProductType = (productType) => {
  if (productTypeMap[productType]) {
    return productTypeMap[productType];
  }
  return productType.replace(/([A-Z])/g, ' $1').trim();
}