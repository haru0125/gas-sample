function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // APIから取得後→
  var resJson = UrlFetchApp.fetch("https://rss.itunes.apple.com/api/v1/jp/ios-apps/top-free/games/100/explicit.json");
  var res = JSON.parse(resJson);
  var activeCnt = 1;
  for (var cnt in res.feed.results) {
    var ret = oldAdd2Check(ss.getSheetByName('applist'), res.feed.results[cnt].name);
    if (ret) {
      sheet.getRange(activeCnt, 1).setValue(parseInt(cnt) + 1);
      sheet.getRange(activeCnt, 2).setValue(res.feed.results[cnt].name);
      sheet.getRange(activeCnt, 3).setValue(res.feed.results[cnt].artistName);
      activeCnt = activeCnt + 1;
    }
  }
}
