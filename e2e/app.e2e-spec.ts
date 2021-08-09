import { element } from 'protractor';
import { AppPage } from './app.po';

describe('Clifford', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('permite crear dominios', () => {
    page.loginAsAdminitrator();
  });
});

