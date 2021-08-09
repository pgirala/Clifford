import { element } from 'protractor';
import { AppPage } from './app.po';

describe('Clifford', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Login de Keycloak', () => {
	browser.ignoreSynchronization = true;
	page.navigateTo();
    browser.wait(ExpectedConditions.visibilityOf(browser.element(by.id('kc-login'))), 10000)
      .then(() => {
          let boton = element(by.id('kc-login'));
          expect(boton.isPresent()).toBe(true);
          element(by.id('username')).sendKeys('pgirala');
          element(by.id('password')).sendKeys('Test@2020');
          boton.click();
          browser.wait(ExpectedConditions.visibilityOf(browser.element(by.cssContainingText('*', 'Seleccione la agrupación de formularios'))), 10000)
            .then(() => {
            browser.ignoreSynchronization = false;
            expect(element(by.cssContainingText('*', 'Pgirala / Oficina de Informática Presupuestaria')).isPresent()).toBeTruthy();
          });
    });
  });
});

