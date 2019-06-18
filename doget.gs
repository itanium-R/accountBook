// ページにアクセスされたときに実行
function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate()
    .setTitle('家計簿APP')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// スプレッドシートのサイドバーで実行
function showSidebar() {
  var htmlOutput = HtmlService.createTemplateFromFile("index").evaluate()
    .setTitle('家計簿APP')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}