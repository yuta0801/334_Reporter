const Discord = require('discord.js'),
			client  = new Discord.Client(),
			mongo   = require('mongodb').MongoClient,
			cronJob = require('cron').CronJob;

require('date-utils');

client.on('ready', () => {
	console.log('I am ready!');
});

var messages = {};

mongo.connect('mongodb://localhost:27017/334', (error, db) => {
	client.on('message', message => {

		addCommand(message, /^計測$/, msg => {
			client.user.setStatus('online');
			client.user.setGame('334観測中～');
		});

		addCommand(message, /^集計$/, msg => {
			client.user.setStatus('dnd');
			client.user.setGame('334集計中～');

			// 集計
			let now  = new Date(),
					time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 34, 0, 0).getTime();
			for (let key in messages) {
				messages[key].diff = messages[key].time - time;
			}
			console.log(messages);
		});

		let now  = new Date(),
				hour = now.getHours(),
				min  = now.getMinutes();
		// if (message.content.match(/334/) && !message.author.bot && hour=='3' && min >= 33 && min < 35) {
			messages[message.channel.guild.id] = {
				id: message.id,
				time: message.createdTimestamp,
				user: message.author.tag,
				server: message.channel.guild.name
			}
		// }
	});

	// new cronJob({
	// 	cronTime: '33 3 * * * *',
	// 	onTick: () => {
	// 		client.user.setStatus('online');
	// 		client.user.setGame('334観測中～');
	// 	}
	// });
	// new cronJob({
	// 	cronTime: '35 3 * * * *',
	// 	onTick: () => {
	// 		client.user.setStatus('dnd');
	// 		client.user.setGame('334集計中～');

	// 		// 集計
	// 		let now  = new Date(),
	// 				time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 34, 0, 0).getTime();
	// 		for (var i=0; i<messages.length; i++) {
	// 			messages[i].time = getTime(messages[i].id);
	// 		}
	// 	}
	// });
});

client.login('MzM4NzY5Nzk1ODIwMjkwMDU4.DFaPdw.ooX4ulRW_Zy0Kq41NMIneMHbHac');

function addCommand(message, cmd, callback) {
	if (message.content.match(cmd)) callback(message.content.match(cmd));
}
