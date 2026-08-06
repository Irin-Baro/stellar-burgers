/// <reference types="cypress" />

const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const SAUCE_ID = '643d69a5c3f7b9001cfa0942';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавляет булку в конструктор по клику на кнопку "Добавить"', () => {
      cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();

      cy.get('[data-cy="constructor-bun-top"]').should('contain', BUN_NAME);
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', BUN_NAME);
    });

    it('добавляет начинку в конструктор по клику на кнопку "Добавить"', () => {
      cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();

      cy.get('[data-cy="constructor-ingredients"]').should(
        'contain',
        MAIN_NAME
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается по клику на ингредиент и показывает данные именно этого ингредиента', () => {
      cy.get(`[data-cy="${BUN_ID}"]`).contains(BUN_NAME).click();

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal"]').should('contain', BUN_NAME);
      cy.url().should('include', `/ingredients/${BUN_ID}`);
    });

    it('закрывается по клику на крестик', () => {
      cy.get(`[data-cy="${BUN_ID}"]`).contains(BUN_NAME).click();
      cy.get('[data-cy="modal"]').should('exist');

      cy.get('[data-cy="modal-close-button"]').click();

      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.get(`[data-cy="${BUN_ID}"]`).contains(BUN_NAME).click();
      cy.get('[data-cy="modal"]').should('exist');

      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'test-access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.visit('/');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('оформляет заказ и очищает конструктор после успешного оформления', () => {
      cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();
      cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();
      cy.get(`[data-cy="${SAUCE_ID}"]`).find('button').click();

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('contain', '12345');

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('[data-cy="constructor-bun-top"]').should(
        'contain',
        'Выберите булки'
      );
      cy.get('[data-cy="constructor-ingredients"]').should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
