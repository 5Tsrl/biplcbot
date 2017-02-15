const request = require('request')
const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')

const token = '275404190:AAG_AklOoz82PDEgM3mylZEuPZQJU8l4dJI'      //biplcbot

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, { polling: true })
bot.getMe().then(function (me) {
  console.log('Hi, my name is %s!', me.username)
})

var msgOpts = {parse_mode : 'Markdown'}

bot.onText(/(\/)?start/, function (msg, match) {
    console.log(getUtente(msg))
    //bot.sendSticker(msg.chat.id, 'stickers/bip.webp').then(function(msg){console.log('send sticker returns',msg)})
    bot.sendSticker(msg.chat.id, 'BQADBAADLgADevHxULRnuviMixswAg')
    bot.sendMessage(msg.from.id, `*Benvenuto!*
    Inserisci il *codice* della tessera  *BIP* di  *Libera Circolazione*
    per verificarne la scadenza e la validità.
    `, msgOpts)
})

/**
 * GESTIONE SERIAL NUMBER          /[0-9]{9}/
 */
 bot.on('message', function (msg) {
       //console.log(msg)
     if(msg.text.match(/\/start/) ) return
     if(msg.text.match( /(\/)?id/i ) return
     var snrex = /[0-9]{9}/
     var found = msg.text.match(snrex)
     if(found){
       getResponse(found[0], function(err, resp){
         if(err){
           bot.sendMessage(msg.from.id, 'qualcosa è andato storto' , msgOpts)
           console.log(err)
         }else {
           bot.sendMessage(msg.from.id, resp , msgOpts)
         }
       })
     } else {
        bot.sendMessage(msg.from.id, 'Il *codice* della tessera BIP è un numero di *9 cifre* posto sul *retro* della tessera',msgOpts)
     }
})


function getResponse(sn, cb){
  var url = 'http://odino/tesseract/index.php?option=com_jumi&fileid=91&SE=' + sn  
  request.get(url, function(err, response, body) {
    if(err) return cb(err)
    //console.log(body)
    cb(null, body)
  })  
}

// Listen for any kind of message.
bot.on('message', function (msg) {
  const log_msg = getUtente(msg) + ' msg:' + msg.text
  console.log(log_msg)
  fs.open("./logs/biplcbot.log", 'a', 0666, function(err, fd) {
      fs.write(fd, log_msg + '\n', doneWriting)
  })
})

function doneWriting(){}
function getUtente(msg){
  return 'id: '+ msg.from.id + ' name: ' + msg.from.first_name +  ' ' + msg.from.last_name
}

bot.onText(/(\/)?id/i, function (msg, match) {
    console.log(getUtente(msg))
    bot.sendMessage(msg.from.id, `Il tuo Telegram ID è *${msg.from.id}*`, msgOpts)
})
