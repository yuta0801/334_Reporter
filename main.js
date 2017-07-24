const Discord = require('discord.js'),
			client  = new Discord.Client(),
			mongo   = require('mongodb').MongoClient,
			cronJob = require('cron').CronJob;

require('date-utils');

client.on('ready', () => {
	console.log('I am ready!');
});

var messages = [];

mongo.connect('mongodb://localhost:27017/334', (error, db) => {
	client.on('message', message => {

		addCommand(message, /^計測$/, msg => {
			client.user.setStatus('online');
			client.user.setGame('334観測中～');
		});

		addCommand(message, /^集計$/, aggregate);

		let now  = new Date(),
				hour = now.getHours(),
				min  = now.getMinutes();
		// if (message.content.match(/334/) && !message.author.bot && hour=='3' && min >= 33 && min < 35) {
			messages.push({
				id:     message.id,
				time:   message.createdTimestamp,
				user:   message.author.tag,
				guild:  message.channel.guild.id,
				server: message.channel.guild.name
			});
		// }
	});

	// new cronJob({
	// 	cronTime: '33 3 * * * *',
	// 	onTick: () => {
	// 		client.user.setStatus('online');
	// 		client.user.setGame('観測中～');
	// 	}
	// });
	// new cronJob({
	// 	cronTime: '35 3 * * * *',
	// 	onTick: () => {}
	// });
});

client.login('MzM4NzY5Nzk1ODIwMjkwMDU4.DFaPdw.ooX4ulRW_Zy0Kq41NMIneMHbHac');

function addCommand(message, cmd, callback) {
	if (message.content.match(cmd)) callback(message.content.match(cmd));
}

// 集計
function aggregate() {
	client.user.setStatus('dnd');
	client.user.setGame('集計中～');

	// 誤差計算
	let now  = new Date(),
			time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 23, 0, 0/*3, 34, 0, 0*/).getTime();
	for (let i=0; i<messages.length; i++) {
		messages[i].diff = messages[i].time - time;
		if (messages[i].diff < 0) messages[i].rank = -1;
	}

	messages.sort((a,b) => {
		if (a.diff < b.diff) return -1;
		if (a.diff > b.diff) return  1;
		return 0;
	});

	// 点数計算
	for (let i=0,s=0,r=-1; i<messages.length; i++) {
		if (messages[i].rank == -1) { s=i; } else { r=i-s; }
		if (r>=0) {
			messages[i].score = 34.36 / r ^ 0.913;
		} else {
			messages[i].score = 0;
		}
		console.log(messages[i].diff, r, messages[i].score);
	}
}

