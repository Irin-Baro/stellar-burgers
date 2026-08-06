import reducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  const initialState = { items: [], isLoading: false, error: null };

  test('getIngredients.pending: включает isLoading и сбрасывает error', () => {
    const state = reducer(
      { ...initialState, error: 'старая ошибка' },
      { type: getIngredients.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('getIngredients.fulfilled: сохраняет данные и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: getIngredients.fulfilled.type, payload: mockIngredients }
    );
    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });

  test('getIngredients.rejected: сохраняет ошибку и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      {
        type: getIngredients.rejected.type,
        error: { message: 'Не удалось загрузить ингредиенты' }
      }
    );
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
    expect(state.isLoading).toBe(false);
  });
});
