import { HandsontablePage } from './app.po';

describe('handsontable App', () => {
  let page: HandsontablePage;

  beforeEach(() => {
    page = new HandsontablePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
