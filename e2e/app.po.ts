import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  loginAsAdminitrator() {
    browser.ignoreSynchronization = true;
    this.navigateTo();
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
  }
}
