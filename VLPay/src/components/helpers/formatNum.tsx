export const formatCurrency = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const escapeCurrency = (value: string): string => {
  return value
    .replace(/-/g, '')
    .replace(/,/g, '')
    .replace(/ /g, '')
    .replace(/\./g, '')
    .replace(/\b0+/g, '');
};
