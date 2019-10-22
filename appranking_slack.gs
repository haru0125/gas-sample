// 起動するファンクション
function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('base');
  var dbsheet = ss.getSheetByName('db');
  
  // ここで事前に生成したURLを呼び出して結果を取得
  var resJson = UrlFetchApp.fetch("https://rss.itunes.apple.com/api/v1/jp/ios-apps/top-free/games/10/explicit.json");
  // JavaScriptで扱いやすくするため戻ってきた結果をJsonからJavaScriptのオブジェクトに変換
  var res = JSON.parse(resJson);
  // アプリ毎の配列でループ処理して結果の一部をシートの対象セルにセット
  var activeCnt = 1;
  for (var cnt in res.feed.results) {
    // db sheet情報とチェックするアプリ名を渡す
    var ret = appCheck(dbsheet, res.feed.results[cnt], cnt);
    if (ret) {
      // rank
      sheet.getRange(activeCnt, 1).setValue(parseInt(cnt) + 1);
      // アプリ名
      sheet.getRange(activeCnt, 2).setValue(res.feed.results[cnt].name);
      // アプリ制作会社
      sheet.getRange(activeCnt, 3).setValue(res.feed.results[cnt].artistName);
      // リリース日
      sheet.getRange(activeCnt, 4).setValue(res.feed.results[cnt].releaseDate);
      activeCnt = activeCnt + 1;
    }
  }
}

// 以前にdb sheetに登録済みかどうかをチェックする
// true : 該当アプリなし
// false : 該当アプリ登録済み
function appCheck(dbsheet, app, baseCnt) {
  // 1行目からアプリ名が存在するかチェックする
  var checkCnt = 1;
  while(true) {
    var val = dbsheet.getRange(checkCnt, 2).getValue();
    if (val == '') {
      // 空行になったらチェックするループを抜ける
      break;
    }
    if (val == app.name) {
      // 同じ名前のアプリが存在しているためfalseで終了
      return false;
    }
    checkCnt++;
  }
  // 同じ名前のアプリが見つからない場合はdb sheetに記録して終了する
  // rank
  dbsheet.getRange(checkCnt, 1).setValue(parseInt(baseCnt) + 1);
  // アプリ名
  dbsheet.getRange(checkCnt, 2).setValue(app.name);
  // アプリ制作会社
  dbsheet.getRange(checkCnt, 3).setValue(app.artistName);
  // リリース日
  dbsheet.getRange(checkCnt, 4).setValue(app.releaseDate);
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
