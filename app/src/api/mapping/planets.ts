type Color =
  | 'Pink'
  | 'Black'
  | 'Purple'
  | 'Blue'
  | 'Teal'
  | 'Green'
  | 'Yellow'
  | 'Orange'
  | 'Red'
  | 'White';

export const planetCategoryIdToNameMapping: { [key: number]: Color } = {
  1: 'Blue',
  2: 'Orange',
  3: 'Green',
  4: 'Pink',
  5: 'White',
  6: 'Purple',
  7: 'Teal',
  8: 'Yellow',
  9: 'Red',
  10: 'Black',
};
