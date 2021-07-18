/*

リファレンス:
https://developers.line.biz/ja/reference/messaging-api/#webhooks

参考:g
https://qiita.com/t_gata/items/897936761695124ef920


*/
/*
function myFunction() {
  Browser.msgBox('Hello GAS!');
}*/
const sampleStampObject = {
  U826610c2d8ec3764742fec37f8f2ecd6 //name
    : {
    date: 1601546643387, //timestamp
    time: 2 //何回スタレンしたか

    //もしかしたら追加するかもしれない
  },
  U5be50c149693d592d17d3e0d5a3a6f99 //name
    : {
    date: 1601546643387, //timestamp
    time: 2 //何回スタレンしたか
    //もしかしたら追加するかもしれない
  },
}

const special_keyword = "id";

function forStamp(event) {
  if (event.message.type === "sticker") {
    var cache = CacheService.getDocumentCache();
    var stampObject = JSON.parse(cache.get("stamp"));
    if (stampObject) {
      stampObject = {};
    }
    var userId = event.source.userId;
    var timestamp = stampObject[userId];
    if (timestamp) {
      timestamp.time++;
    } else {
      timestamp.date = event.timestamp;
    }
    cache.put("stamp", JSON.stringify(stampObject));
  }
}


//LINE Notifyへメッセージを送る
function sendNotify(id) {
  //アクセスさせるエンドポイントURLを指定
  var url = "https://api.line.me/v2/bot/message/push";
  const message = {
    "type": "text",
    "text": "登録しました。\nあなたのidは" + id + "です。"
  };
  const messages = [message];
  const body = {
    "to": id,
    "messages": messages,
  };
  //オプション指定
  var options = {
    muteHttpExceptions: true,
    method: "post",
    payload: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer Y7aj6jzaLx6D2PUfB74gpIv3lKX5vrX56UR7s5sU3ak3jsIR+eLQK1mUzPfcrJa8YHK0HSB+049egtU7/Q0X+XszNRMf39FB4hT+bVGK8HpP6qOj/g2KJgpTOZKjXGgH7q06LMgLmthIsS1+uX3ewgdB04t89/1O/w1cDnyilFU="
    }
  };

  //通知を送る
  UrlFetchApp.fetch(url, options);
}



function test() {
  var a = JSON.parse("null");
  if (a) {
    Logger.log("ofString");
  } else {
    Logger.log("ofSt");
  }
}

function getIDfromLINEmessageFromusermessage(e) {
  if (e.events) {
    const events = e.events[0];
    if (events.message) {
      const message = events.message;
      if (message.type) {
        const type = message.type;
        if (type === "text") {
          if (events.source) {
            const source = events.source;
            if (source.type) {
              const ttype = source.type;
              if (ttype === "user") {
                if (message.text) {
                  const text = message.text;
                  if (text === special_keyword) {
                    if (source.userId) {
                      return source.userId;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}


function getIDfromLINEmessageFromEverymessage(e) {
  if (e.events && e.events.length) {
    const events = e.events[0];
    if (events.message) {
      const message = events.message;
      if (message.type) {
        const type = message.type;
        //if (type === "text") {
        if (events.source) {
          const source = events.source;
          if (source.type) {
            const ttype = source.type;
            /*
            if (ttype === "user") {
            if (message.text) {
                const text = message.text;
                if (text === special_keyword) {
                  */
            if (source.userId) {
              return source.userId;
            }
          }
        }
      }
    }
  }
}


function setcontestlineids() {
  const cache = PropertiesService.getScriptProperties();

  cache.setProperty("contestlineids", "[]");
}

function try_getIDfromLINEmessageFromusermessage() {
  const e = {
    "events": [{
      "type": "message",
      "replyToken": "2ae9ed241eec4ea789c1d8d4566930ae",
      "source": {
        "userId": "Ua298b686b741effe246e56d39d7aaefa",
        "type": "user"
      },
      "timestamp": 1610452912310,
      "mode": "active",
      "message": {
        "type": "text",
        "id": "13369620782497",
        "text": "id"
      }
    }],
    "destination": "U4c5a6edd8eb8354eed898f5daf8ca82e"
  }
  const d = getIDfromLINEmessageFromusermessage(e);
  Logger.log(d)
}

function doPost(e) {
  const ofString = e.postData.contents;
  const event = JSON.parse(ofString);
  //forStamp(event);
  const messageFromLine =
    JSON.stringify(event, undefined, 4);
  const sheet = SpreadsheetApp.getActiveSheet();
  const date = new Date();
  const cache = PropertiesService.getScriptProperties();
  const userId = getIDfromLINEmessageFromusermessage(event);
  var contestlineids = JSON.parse(cache.getProperty("contestlineids"));
  if (contestlineids) {
    //Logger.log("SSS")
  } else {
    contestlineids = []
  }
  if (userId) {
    contestlineids.push(userId);
    contestlineids = Array.from(new Set(contestlineids));
    sendNotify(userId);
    cache.setProperty("contestlineids", JSON.stringify(contestlineids));
  }
  const values = [
    [Utilities.formatDate(date, "JST", "yyyy/MM/dd (E) HH:mm:ss Z"), messageFromLine, "", "", "", "", "", "=GETLINEACCOUNTNAME(B2)"],
  ];
  sheet.insertRows(2, 1);
  sheet.getRange(2, 1, 1, 8).setValues(values);

  //var json = JSON.parse(ofString);
  //var signature = getSignature(contents);
  //var user_message = json.events[0].message.text;  
  //Logger.log(ofString);
  //Logger.log("ofString");
};

function doGet(e) {
  const cache = PropertiesService.getScriptProperties();
  var contestlineids = cache.getProperty("contestlineids");
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(contestlineids);
  // return response-data
  return output;
};

function ttt() {
  const x = 1;
  const y = 2;
  const b = `${x}と${y}の足し算=${x + y}です。`
  const c = ``
  Logger.log(c + "aa")
}


/**
 * return the value * 3
 */
function TRIPLE(input) {
  return input * 3;
}

/**
 * return account information from message event.
 */
function GETLINEACCOUNTNAME(input) {

  const event = JSON.parse(input);
  const userId = getIDfromLINEmessageFromEverymessage(event);
  if (userId) {
    //log
  } else {
    return "null"
  }

  //アクセスさせるエンドポイントURLを指定
  const url = "https://api.line.me/v2/bot/profile/" + userId;

  //オプション指定
  const options = {
    muteHttpExceptions: true,
    //method  : "get",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer Y7aj6jzaLx6D2PUfB74gpIv3lKX5vrX56UR7s5sU3ak3jsIR+eLQK1mUzPfcrJa8YHK0HSB+049egtU7/Q0X+XszNRMf39FB4hT+bVGK8HpP6qOj/g2KJgpTOZKjXGgH7q06LMgLmthIsS1+uX3ewgdB04t89/1O/w1cDnyilFU="
    }
  };

  //通知を送る
  const res = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  if (res) {
    return JSON.stringify(res, undefined, 4);;
  } else {
    return "null";
  }
}