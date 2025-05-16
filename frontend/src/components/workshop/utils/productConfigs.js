export const LiveEdgeSlabConfig = [
  { label: 'Length',  placeholder: 'Enter length', type: 'number', value: 'length' },
  { label: 'Width', placeholder: 'Enter width', type: 'number', value: 'width' },
  { label: 'Thickness', placeholder: 'Enter thickness', type: 'number', value: 'thickness' },
  { label: 'Species', placeholder: 'Enter species', type: 'text', value: 'species' },
  { label: 'Dried', type: 'switch', value: 'dried' }
]

export const CustomProductConfig = [
  { label: 'Metadata', placeholder: 'Enter metadata', type: 'text', value: 'metadata' },
];

export const PRODUCT_FORM_CONFIGS = {
  'LiveEdgeSlab': LiveEdgeSlabConfig,
  'CustomProduct': CustomProductConfig
}

export const getProductFormConfig = (productType) => {
  return PRODUCT_FORM_CONFIGS[productType] || [];
}