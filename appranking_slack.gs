// 起動するファンクション
function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dbsheet = ss.getSheetByName('db');
  
  // ここで事前に生成したURLを呼び出して結果を取得
  var resJson = UrlFetchApp.fetch("https://rss.itunes.apple.com/api/v1/jp/ios-apps/top-free/games/100/explicit.json");
  // JavaScriptで扱いやすくするため戻ってきた結果をJsonからJavaScriptのオブジェクトに変換
  var res = JSON.parse(resJson);
  // アプリ毎の配列でループ処理して結果の一部をシートの対象セルにセット
  var activeCnt = 1;
  var slackmsg = "";
  for (var cnt in res.feed.results) {
    // db sheet情報とチェックするアプリ名を渡す
    var ret = appCheck(dbsheet, res.feed.results[cnt], cnt);
    if (ret) {
      // rank
      slackmsg = slackmsg + "rank:" + (parseInt(cnt) + 1) + "\n";
      slackmsg = slackmsg + "アプリ名:" + res.feed.results[cnt].name + "\n";
      slackmsg = slackmsg + "アプリ会社:" + res.feed.results[cnt].artistName + "\n";
      slackmsg = slackmsg + "リリース日:" + res.feed.results[cnt].releaseDate + "\n";
      slackmsg = slackmsg + "URL:" + res.feed.results[cnt].url + "\n";
      slackmsg = slackmsg + "----------\n"
      activeCnt = activeCnt + 1;
    }
  }
  if (!slackmsg) {
    // 新着アプリがない場合のメッセージ送信
    slackmsg = "新規アプリはありません"
  }
  slackPost(slackmsg);
}

// Slack送信用Function
function slackPost(message) {
  var jsonData = {
     "username" : "gasbot",
     "text" : message
  };
  var payload = JSON.stringify(jsonData);
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };
  // https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  UrlFetchApp.fetch("https://hooks.slack.com/services/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", options);
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
