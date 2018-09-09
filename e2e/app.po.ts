import { browser, element, by } from 'protractor';

export class LbdFreeAngularcliPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('aka-root h1')).getText();
  }
}
