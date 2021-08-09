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
            expect(element(by.id('kc-login')).isPresent()).toBe(true);
    });
  });
});

