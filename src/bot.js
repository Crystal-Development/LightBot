var Discord = require("discord.js");

const chalk = require('chalk');

var bot = new Discord.Client();

const config = require("./config.json");

//*   Perms
const GetPermissionLevel = (user) => {
    var guildmemberobject = true;
    if (typeof (user.guild) == "undefined") {
        guildmemberobject = false;
    }
    var presumed_rank = 0;


    if (guildmemberobject == true) {
        if (user.guild.owner == user) {
            presumed_rank = 5;
            // Owner
            //  (you can edit perms if you know how too)
        } else {
            if (user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_CHANNELS") || user.hasPermission("MANAGE_GUILD") || user.hasPermission("BAN_MEMBERS")) {
                presumed_rank = 4;
                // Head Administrator
            } else {
                if (user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_CHANNELS") || user.hasPermission("MANAGE_GUILD")) {
                    presumed_rank = 3;
                    // Administrator
                } else {
                    if (user.hasPermission("KICK_MEMBERS") || user.hasPermission("MANAGE_MESSAGES") || user.hasPermission("MANAGE_NICKNAMES")) {
                        presumed_rank = 2;
                        // Moderator
                    } else {
                        if (user.hasPermission("EMBED_LINKS") || user.hasPermissions("ATTACH_FILES") || user.hasPermission("SEND_TTS_MESSAGES") || user.hasPermission("CHANGE_NICKNAME")) {
                            presumed_rank = 1;
                            // Previleged
                        } else {
                            if (user.hasPermissions("READ_MESSAGES")) {
                                presumed_rank = 0;
                                // Normie
                            }
                        }
                    }
                }
            }
        }
    }


    return presumed_rank;
}

var guildmem;













//*  Message function
bot.on("message", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    let command = message.content.split(" ")[0];
    command = command.slice(config.prefix.length);

    let args = message.content.split(" ").slice(1);





    message.guild.members.forEach(function (member) {
        if (String(member.user.id) == String(message.author.id)) {
            guildmem = member;
        }
    });
    if (typeof (guildmem) !== "undefined") {
        var theirperm = GetPermissionLevel(guildmem);
    }



    //help
    if (message.content.startsWith(config.prefix + "help")) {
        message.delete(" ");
        message.author.send("```kick - Kick A User (Staff Only)\nban - Ban A User (Staff Only)\nsay - Repeats Your Message (Owner Only)\nembed - Repeats You Message As An Embed (Owner Only)\nreport <@mention> <reason> - Reports A User To Staff\nroll - Roll the Dice\nversion - Says The Bot's Version\nping - Shows The Bot's Ping\nrestart - Restarts The Bot (Staff Only)\ninvite - Sends Invite Link (Owner Only)\nnick - Sets a user's nickname (Staff Only)\nannounce - Sends a message to #news tagging everyone (Staff Only)\nmaint - Puts bot in maintenance mode (Owner Only)\nnomaint - Exits maintenance mode (Owner Only)```");
    }

    // Simple roll the dice command
    if (message.content == config.prefix + "roll") { //command args
        message.delete();

        var roll = Math.floor(Math.random() * 6) + 1; //math stuff

        message.channel.send(":game_die: " + message.author + " rolled a " + "``" + roll + "``" + "!") //bot replies
    }

    // Version command

    if (message.content == config.prefix + "version") {

        message.channel.send('Version ``' + config.version + '``');
    }

    //nickname
    if (message.content.startsWith(config.prefix + "nick")) {
        message.delete();
        const member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        member.setNickname(args);
        message.channel.send(":white_check_mark: " + args + "'s nick has been changed.")
            .then(m => m.delete(5000))
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    //set bot game
    if (message.content.startsWith(config.prefix + "setgame")) {
        if (message.author.id !== '186989309369384960') return;
        let args = message.content.split(" ").slice(1).join(" ");
        bot.user.setPresence({ game: { name:  args , type: 0 } });
        message.delete();
    }

    
    /* nolinks  WIP
    var link = new RegExp('http')
    if (message.content == (link)) {
        
        if (message.author.roles.has('360974519781031946')) {
            null
        } else {
            message.delete();
        }
    }
    */

    //announce
    if (message.content.startsWith(config.prefix + "announce")) {
        message.delete();
        let args = message.content.split(" ").slice(1).join(" ");
        const newsembed = new Discord.RichEmbed()
            .setTitle(" :loudspeaker: Announcement")
            .setColor("#7289DA")
            .setTimestamp()
            .setDescription(args)
            .setFooter(message.author.username)
        if (theirperm >= 3) {
            bot.channels.get('323201519891513345').send("@everyone");
            bot.channels.get('323201519891513345').send(newsembed);
            };
        
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    //ban command
    if (message.content.startsWith(config.prefix + "ban")) {
        message.delete();
        const member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        if (member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(":x: That user is Staff!")
                .then(m => m.delete(5000));
            console.log(chalk.bold.red("[!]") + "Failed to ban user! (Staff)")
        }
        else {
            if (theirperm >= 3) {
                message.channel.send(":white_check_mark:" + member + " has been banned.");
                member.send(":warning: You have been banned from our server by " + message.author + "\n\nReason:\n```" + args + "```").then(() => {
                    member.ban(args)
                        .catch(e => console.log(e))
                });
            }
            if (theirperm <= 3) {
                message.channel.send("Sorry, you aren't able to do that.");
            }
        }
    }

    //ping
    if (message.content.startsWith(config.prefix + "ping")) {
        message.delete(" ");
        message.channel.send(":ping_pong: Pong! " + "``" + (new Date().getTime() - message.createdTimestamp) + "ms" + "``")
            .then(m => m.delete(5000))
    }
    
    //mute command
    if (message.content.startsWith(config.prefix + 'mute')) {
        message.delete();
        const member = message.mentions.members.first();
        member.addRole('325621766707871744');
        member.removeRole('325387555287728139');
        message.channel.send(':white_check_mark: Muted ' + member)
           .then(m => m.delete(5000))
    }

    //unmute command
    if (message.content.startsWith(config.prefix + 'unmute')) {
        message.delete();
        const member = message.mentions.members.first();
        member.addRole('325387555287728139');
        member.removeRole('325621766707871744');
        message.channel.send(':white_check_mark: Unmuted ' + member)
            .then(m => m.delete(5000))
    }

    //say command
    if (message.content.startsWith(config.prefix + 'say')) {
        if (message.author.id !== '186989309369384960') return;
        let args = message.content.split(" ").slice(1).join(" ");
        message.delete();
        message.channel.send(args);
    }

    //say embed command
    if (message.content.startsWith(config.prefix + 'embed')) {
        if (message.author.id !== '186989309369384960') return;
        let args = message.content.split(" ").slice(1).join(" ");
        message.delete();
        message.channel.send({
            embed: {
                color: 3447003,
                description: (args)
            }
        })
}
    //KICK
    if (message.content.startsWith(config.prefix + "kick")) {
        message.delete();
        const member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        if (member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(":x: That user is Staff!")
                .then(m => m.delete(5000));
            console.log(chalk.bold.red("[!]") + "Failed to kick user! (Staff)")
        }
        else {
            if (theirperm >= 3) {
                message.channel.send(":white_check_mark:" + member + " has been kicked.");
                member.send(":warning: You have been kicked from our server by " + message.author + "\n\nReason:\n```" + args + "```").then(() => {
                    member.kick(args)
                        .catch(e => console.log(e))
                });
            }
            if (theirperm <= 3) {
                message.channel.send("Sorry, you aren't able to do that.");
            }
        }
    }

    //report command
    if (message.content.startsWith(config.prefix + "report")) {
        message.delete();
        let member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        bot.channels.get('345993413688033280').send('<@&342038243308601346>, ' + message.author + ' has reported ' + member + '\nReason: ```'+ args + '```');
        message.channel.send(':white_check_mark: Sucessfully Reported ' + member + '!')
            .then(m => m.delete(5000))
    }

    //link perms
    if (message.content.startsWith(config.prefix + "permit")) {
        message.delete();
        let member = message.mentions.members.first();
        member.addRole('360974519781031946');
        message.channel.send(':white_check_mark: Permitted ' + member)
            .then(m => m.delete(10000));
        setTimeout(function () { member.removeRole('360974519781031946'); }, 5000);
    }


   //maintenence mode
    if (message.content.startsWith(config.prefix + "maint")) {
        message.delete();
        if (message.author.id !== '186989309369384960') return;
        bot.user.setPresence({ game: { name: "Under Maintenance", type: 0 } });
        bot.user.setStatus("idle");
        message.channel.send(':white_check_mark: Entering maintenence mode!')
            .then(m => m.delete(5000));
        console.log(chalk.bold.yellow("[!]") + "Entering Maintenance Mode!");
    }

    //turn off maintenance mode
    if (message.content.startsWith(config.prefix + "nomaint")) {
        message.delete();
        if (message.author.id !== '186989309369384960') return;
        bot.user.setPresence({ game: { name: ".help | Online", type: 0 } });
        bot.user.setStatus("online");
        message.channel.send(':white_check_mark: Exiting maintenence mode!')
            .then(m => m.delete(5000));
        console.log(chalk.bold.yellow("[!]") + "Exiting Maintenance Mode!");
    }

    //invite to ur own server
    if (message.content == config.prefix + "invite") {
        if (message.author.id !== '186989309369384960') {
            message.channel.send(':white_check_mark: Check your DMs!');
            message.author.send({
                embed: {
                    color: 3447003,
                    description: "Invite me from [here](https://discordapp.com/oauth2/authorize?client_id=286684868023287811&scope=bot&permissions=8)"
                }
            }); //https://discordapp.com/oauth2/authorize?client_id=286684868023287811&scope=bot&permissions=8     
        }

        if (theirperm <= 3) {
            message.channel.send("Invalid permissions. Only administrators can do that.")
        }
    }

    // Refresh bot (necessary)
    if (message.content == config.prefix + "restart") {
        message.delete();
        if (theirperm == 5) {
				console.log(chalk.bold.green('[!]') + chalk.white('Restarting Bot...'));
                process.exitCode = 1;
                process.exit();
            }

        if (theirperm <= 5) {
            message.channel.send(":x: That command is staff only!")
        }
    }
})




//* Startup stuff
bot.login(config.token)
bot.on("ready", () => {
    bot.user.setPresence({ game: { name: ".help | Online", type: 0 } });
    console.log(chalk.bold.green('[!]') + chalk.white('Bot Ready!'));
    bot.channels.get('320651061423636490').send(":ok_hand:  Ready For Commands!")
        .then(m => m.delete(5000))
})
