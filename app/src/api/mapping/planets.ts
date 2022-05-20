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
  | 'Pink'
  | 'White';

export const planetCategoryIdToNameMapping: { [key: number]: Color } = {
  1: 'Blue',
  2: 'Orange',
  3: 'Green',
};
