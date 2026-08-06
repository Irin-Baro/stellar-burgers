import { rootReducer } from './store';

describe('rootReducer', () => {
  test('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const state = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
