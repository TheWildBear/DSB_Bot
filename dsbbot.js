/*jshint esversion: 6 */
const util = require('util');
const DSB = require('dsbapi');
const http = require('http');
const TeleBot = require('telebot');
const bot = new TeleBot('your_token');
const dsb = new DSB('username', 'password');
const scrape = require('website-scraper');
const untis = require("untis-api");
const untis_entities = untis.entities;
const fs = require('fs');
const cheerio = require('cheerio');

console.log("Bot started and api connected");

//start and connect bot
bot.start();

//start msg
bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!\nThis bot is a free software program, so you are allowed to redistribute it yourself! This program is from @thewildbear'));

bot.on([/dumpinfo*/, '/dumpinfo'] ,(msg) => {
	let infofrommsg = util.inspect(msg, false, null);
	msg.reply.text(infofrommsg);
});

bot.on(['/gettimetable'], (msg) => {
	gettimetable = function () {
		data = dsb.fetch().then(data => {
			const timetables = DSB.findMethodInData('timetable', data);
			let timetables2 = timetables.data[0].url;
			console.log(util.inspect(timetables2,false,null));
			//show link for debugging
			let suffix = 'your/suffix/.htm'; // change this suffix for matching your timetable
			//set suffix
			let test = timetables2.substring(0, timetables2.indexOf('index.html')) + suffix;
			//stitch the links together
			console.log(test);
			//send link to dsbsite
			bot.sendMessage(msg.from.id, test);
						
			//method through http get and cheerio 
			
			//set options for page
			var options = {
					host: 'app.dsbcontrol.de',
					port: 80,
					path: '/link/to/htmfile/.htm''
			};
			
			//var for html stuff
			var html = '';
			
			//download html and handle
			http.get(options, function(res){
				res.on('data', function(data){
					html += data;
				}).on('end', function(){
					//do stuff with html code
					console.log(html);
					
					
				});
			});
}).catch(e => {
        // An error occurred :(
        console.log(e);
	});
};
  gettimetable();
});

//test connectivity to api
bot.on(['/up'], (msg) => {
	testfunc = function () {
      let up = untis.info;
      up = util.inspect(up, false, null);
      bot.sendMessage(msg.from.id, ` ${ up } `);
   };
  testfunc();
});

//send news
bot.on(['/news'], (msg) => {
	
	getnews = function () {
		dsb.fetch().then(data => {
			const news = DSB.findMethodInData('news', data);
			let deflatednews = util.inspect(news, false, null);
			bot.sendMessage(msg.from.id, `Here are youre news: ${ deflatednews }!`);
		}).catch(e => {
        	// An error occurred :(
        	console.log(e);
		});
	};
	
getnews();

});

//send entenparty
bot.on(['/ente'], (msg) => msg.reply.text('Woop! \nWoooop!! \nWooooooop!!! \nEntenpartyyyyy!!!!!!!!!!!!!'));

//get subsitiutiontable
bot.on(['/substitution'], (msg) =>{
	getsubstitution = function () {
		
		data = dsb.fetch().then(data => {
		const newsubstitution = DSB.findMethodInData('timetable', data);
		let substitutiontg;
		
    //specify directory for correct functioning
		var options = {
 		urls: 'app.dsbcontrol.de',
  		directory: '/link/to/htmfile/.htm'
  		};
		
		// or with callback
		scrape(options, (error, result) => {
    	/* some code here */
    	bot.sendMessage(msg.from.id, `Here are youre news: ${ result }!`);
		});		
				
	}).catch(e => {
        // An error occurred :(
        console.log(e);
});
	};
	getsubstitution();	
});

/*
 * on kitty or cat send a cat picture
 */ 
bot.on(/(show\s)?kitty*/, (msg) => {
	return msg.reply.photo('http://thecatapi.com/api/images/get');
});

bot.on(/(show\s)?cat*/, (msg) => {
    return msg.reply.photo('http://thecatapi.com/api/images/get');
});
