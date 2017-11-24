/*jshint esversion: 6 */
console.log('Welcome!\nThis bot is a free software program, so you are allowed to redistribute it yourself! This program is from @thewildbear');
const fs = require('fs');
var token = '';
var DSBusr = '';
var DSBpwd = '';
const util = require('util');
const DSB = require('dsbapi');
const http = require('http');
const TeleBot = require('telebot');
const scrape = require('website-scraper');
const untis = require("untis-api");
const untis_entities = untis.entities;
const DomParser = require('dom-parser');
const parser = new DomParser();
const cheerio = require('cheerio');
//variables
var timetabletextsuffix = "The timetable for this week is: \n";
var timetabletext = "";
//suffix for the html site
var suffix = 'suffix/to/yourclassestimetable.htm';
var link;
var valueofcell = "\t";
var html = '';
var row = 0;
var counter = 0;
var counter2 = 0;
var first = 0;
var pathtotimetable = '/path/to/your/time/table.htm';
//load credentials from file
fs.exists('./credentials', (exists) => {
	if (exists) {
		console.log('credentials file exists and is now loaded');
		
		fs.readFile('./credentials', 'utf8', function(err, credentialsdata){
			if (err) throw err;
			credentialsdata = credentialsdata.toString();
			var credentials = credentialsdata.split(',');
			token = credentials[0];
			DSBusr = credentials[1];
			DSBpwd = credentials[2];
			DSBpwd = DSBpwd.replace(/(\n)/gm,"");
		});
	} else {
		fs.open('./credentials', 'wx', (err, fd) => {
			if (err) throw err;
			console.error("The credentials file was not found, it's now created please fill it!");
			fs.writeFile('./credentials', "Your_Telegram_Token,DSBusr,DSBpwd", function(err){
				if(err)
				{
					return console.error(err);
				}
				process.exit(1);
			})
			
	    });
		
	}
});

setTimeout(() => {
const bot = new TeleBot(token);
const dsb = new DSB(DSBusr, DSBpwd);

//start and connect bot
bot.start();

//start msg
bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!\nThis bot is a free software program, so you are allowed to redistribute it yourself! This program is from @thewildbear'));

bot.on([/dumpinfo*/, '/dumpinfo'] ,(msg) => {
	msg.reply.text(util.inspect(msg, false, 99));
});

bot.on(['/gettimetable'], (msg) => {
	gettimetable = function () {
		data = dsb.fetch().then(data => {
			let timetables = DSB.findMethodInData('timetable', data);
			let timetables2 = timetables.data[0].url;
			//show link for debugging
			let link = timetables2.substring(0, timetables2.indexOf('index.html')) + suffix;
			//stitch the links together
			console.log("\nRequested timetable from: " + msg.from.id + " username: " +  msg.from.username + " at the time: " + Date() + "\n" + link + "\n");
			//send link to dsbsite
			bot.sendMessage(msg.from.id, "The current link to the timetable is: " + link + "\nat time: " + Date());
			
			//set options for page
			var options = {
					host: 'app.dsbcontrol.de',
					port: 80,
					path: pathtotimetable
			};
			
			//var for html stuff
			html = '';
			
			//download html and handle
			http.get(options, function(res){
				res.on('data', function(data){
					html += data;
				}).on('end', function(){
					//do stuff with html code
					
					$ = cheerio.load(html); //load html code into cheerio
					//tbody
					$('table').each(function(){
						if(counter!==0)
						{
							valueofcell = $(this).text().trim();
							valueofcell = valueofcell.replace(/(\r\n|\n|\r)/gm," ");
							timetabletext = timetabletext + valueofcell + " ";
						}

						if(row<5){
							if(counter2!==0){
								counter++;
								counter2++;
								row++;
								//cell++;
							}else{
								counter2++;
							}
						}else{
							row=0;
							//cell=0;
							timetabletext = timetabletext + "\n";
						}
						
					});
					let timetabletextstiched = timetabletextsuffix + timetabletext;
					msg.reply.text(timetabletextstiched, { parseMode: 'markdown' });
					//reset vars
					timetabletext = "";
					counter = 0;
					counter2 = 0;
					row = 0;
					
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
		
		var options = {
 		urls: 'app.dsbcontrol.de',
  		directory: '/link/to/your/table'
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



}, 2000);
