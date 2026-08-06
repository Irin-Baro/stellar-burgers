import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const bun: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: '2',
  name: 'Соус',
  type: 'sauce',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('burgerConstructorSlice', () => {
  const initialState = { bun: null, ingredients: [] };

  test('addIngredient: булка попадает в поле bun', () => {
    const state = reducer(initialState, addIngredient(bun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe('Булка');
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient: начинка добавляется в массив ingredients', () => {
    const state = reducer(initialState, addIngredient(sauce));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Соус');
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('removeIngredient: удаляет ингредиент по id', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [{ ...sauce, id: 'test-id-1' } as TConstructorIngredient]
    };
    const state = reducer(stateWithItem, removeIngredient('test-id-1'));
    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient: меняет порядок ингредиентов', () => {
    const item1 = {
      ...sauce,
      id: 'id-1',
      name: 'Первый'
    } as TConstructorIngredient;
    const item2 = {
      ...sauce,
      id: 'id-2',
      name: 'Второй'
    } as TConstructorIngredient;
    const stateWithItems = { bun: null, ingredients: [item1, item2] };
    const state = reducer(stateWithItems, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  test('clearConstructor: очищает булку и ингредиенты', () => {
    const filledState = {
      bun: bun as unknown as TConstructorIngredient,
      ingredients: [{ ...sauce, id: 'id-1' } as TConstructorIngredient]
    };
    const state = reducer(filledState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
