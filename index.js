'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const ngrok = require('ngrok');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// base URL for webhook server
let baseURL = process.env.BASE_URL;



// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// serve static and downloaded files
app.use('/static', express.static('static'));
app.use('/downloaded', express.static('downloaded'));

app.get('/callback', (req, res) => res.end(`I'm listening. Please access with POST.`));

// webhook callback
app.post('/callback', line.middleware(config), (req, res) => {
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  // 配列.map(コールバック関数)　コールバック関数によって新しい配列を生成する

  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source) {

  // const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;

//modified for local server because of requirement of url, started

  const buttonsImageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/%E3%81%B0%E3%82%89%E3%81%9A%E3%81%97%E3%81%AE%E6%9D%90%E6%96%99%E4%BE%8B.jpg/320px-%E3%81%B0%E3%82%89%E3%81%9A%E3%81%97%E3%81%AE%E6%9D%90%E6%96%99%E4%BE%8B.jpg";

  const medical_houmon_iryou_man = "https://1.bp.blogspot.com/-c_09YwfX0og/VahRoPvLIwI/AAAAAAAAvuE/netnwrZnQLo/s800/medical_houmon_iryou_man.png";


//modified for local server ended

// values initialize
  let question = "";
  let label1, label2,label3, label4,label5,label6 = "";
  let text1, text2, text3, text4, text5, text6 = "";
  let [mes, currentScore] = message.text.split(":"); 

  //inserted start
  if (message.text === '開始') {
    currentScore = 0;
    question = "臨床的な予後の予測は？または医者はどれくらいの寿命とみている？";

    label1 = "1~2週";
    text1 = "prognosis トータルスコア:"+String(Number(currentScore)+ 8.5);
    message = text1;

    label2 = "3~4週";
    text2 = "prognosis トータルスコア:"+String(Number(currentScore)+ 6);
    message = text2;

    label3 = "5~6週";
    text3 = "prognosis トータルスコア:"+String(Number(currentScore)+ 4);
    message = text3;

    label4 = "7~10週";
    text4 = "prognosis トータルスコア:"+String(Number(currentScore)+ 2.5);
    message = text4;

    label5 = "11~12週";
    text5 = "prognosis トータルスコア:"+String(Number(currentScore)+ 2.5);
    message = text5;

    label6 = "13週以上";
    text6 = "prognosis トータルスコア:"+String(Number(currentScore)+ 0);
    message = text6;

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"prognosis",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label3,
                "text": text3,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label4,
                "text": text4,
              }
            },
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label5,
                "text": text5,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label6,
                "text": text6,
              }
            },
          ]
        }
      }
    );
  } else if (/^prognosis/.test(message.text)) {
    question = "全身状態はどれにあてはまりますか？";

    label1 = "正常、臨床症状なし";
    text1 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text1;

    label2 = "軽い症状があるが正常の活動可能";
    text2 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text2;

    label3 = "症状があるが努力して正常の活動が可能";
    text3 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text3;

    label4 = "自分の世話はできるが正常の活動不可能";
    text4 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text4;

    label5 = "看護および定期的な医療行為が必要";
    text5 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text5;

    label6 = "動けず、適切な医療および看護が必要";
    text6 = "KPS トータルスコア:"+String(Number(currentScore)+ 0);
    message = text6;

    console.log(question);

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"ps",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label3,
                "text": text3,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label4,
                "text": text4,
              }
            },
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label5,
                "text": text5,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label6,
                "text": text6,
              }
            },
          ]
        } 
      }
    );
  
  } else if (/^KPS/.test(message.text)) {
    question = "食欲は？";

    label1 = "食欲あり";
    text1 = "appetite トータルスコア:"+String(Number(currentScore)+ 1.5);
    message = text1;

    label2 = "食欲なし";
    text2 = "appetite トータルスコア:"+String(Number(currentScore)+ 0);
    message = text2;

    console.log(question);

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"ps",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
          ]
        } 
      }
    );
  
  } else if (/^appetite/.test(message.text)) {
    question = "呼吸困難は？";

    label1 = "呼吸困難あり";
    text1 = "dyspnea トータルスコア:"+String(Number(currentScore)+ 1.0);
    message = text1;

    label2 = "呼吸困難なし";
    text2 = "dyspnea トータルスコア:"+String(Number(currentScore)+ 0);
    message = text2;

    console.log(question);

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"ps",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
          ]
        } 
      }
    );
  
  } else if (/^dyspnea/.test(message.text)) {
    question = "白血球数(/m㎥)は？";

    label1 = ">11000";
    text1 = "WBC トータルスコア:"+String(Number(currentScore)+ 1.5);
    message = text1;

    label2 = "8501～11000";
    text2 = "WBC トータルスコア:"+String(Number(currentScore)+ 0.5);
    message = text2;

    label3 = "≦8500";
    text3 = "WBC トータルスコア:"+String(Number(currentScore)+ 0);
    message = text3;

    console.log(question);

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"ps",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label3,
                "text": text3,
              }
            },
          ]
        } 
      }
    );
  
  } else if (/^WBC/.test(message.text)) {
    question = "リンパ球 (%)は？";

    label1 = "0～11.9";
    text1 = "lymph トータルスコア:"+String(Number(currentScore)+ 2.5);
    message = text1;

    label2 = "12～19.9";
    text2 = "lymph トータルスコア:"+String(Number(currentScore)+ 1.0);
    message = text2;

    label3 = "≧20";
    text3 = "lymph トータルスコア:"+String(Number(currentScore)+ 0);
    message = text3;

    console.log(question);

    return client.replyMessage(
      replyToken,
      {
        "type":"text",
        "label":"ps",
        "text": question,
        "quickReply":　{ 
          "items": [
            {
              "type": "action", 
              "action": {
                "type": "message",
                "label": label1,
                "text": text1,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label2,
                "text": text2,
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": label3,
                "text": text3,
              }
            },
          ]
        } 
      }
    );
  
  }
}

function handleImage(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
    const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        // ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);

        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        };
      });
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'image',
          originalContentUrl,
          previewImageUrl,
        }
      );
    });
}

function handleVideo(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp4`);
    const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        // FFmpeg and ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        }
      });
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'video',
          originalContentUrl,
          previewImageUrl,
        }
      );
    });
}

function handleAudio(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.m4a`);

    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        return {
            originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
        };
      });
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'audio',
          originalContentUrl,
          duration: message.duration,
        }
      );
    });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId)
    .then((stream) => new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(downloadPath);
      stream.pipe(writable);
      stream.on('end', () => resolve(downloadPath));
      stream.on('error', reject);
    }));
}

function handleLocation(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'location',
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude,
    }
  );
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'sticker',
      packageId: message.packageId,
      stickerId: message.stickerId,
    }
  );
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (baseURL) {
    console.log(`listening on ${baseURL}:${port}/callback`);
  } else {
    console.log("It seems that BASE_URL is not set. Connecting to ngrok...");
    ngrok.connect(port, (err, url) => {
      if (err) throw err;

      baseURL = url;
      console.log(`listening on ${baseURL}/callback`);
    });
  }
});
