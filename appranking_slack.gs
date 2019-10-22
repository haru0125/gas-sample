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

// true:該当アプリなし
// false:該当アプリあり
function oldAdd2Check(sheet, name) {
  var i = 1;
  while(true) {
    var val = sheet.getRange(i, 1).getValue();
    if (val == '') {
      break;
    }
    if (val == name) {
      return false;
    }
    i++;
  }
  return true;
}

// menu追加
function onOpen(event){
  // 配列で登録したいメニューを追加する
  var func = [
    // name:部分にメニューで表示したい名前
    // functionName:登録したいfunction名
    {name:'appranking', functionName:'myFunction'}
  ];
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  // Sheet上のメニューに登録する名前
  sheet.addMenu('myMenu', func);
}
