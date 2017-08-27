var Discord = require("discord.js");


var bot = new Discord.Client();

const config = require("./config.json");

//*   Perms
function GetPermissionLevel(user) {
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
        message.author.send("LightBot Commands:\n```kick - Kick A User (Staff Only)\nban - Ban A User (Staff Only)\nsay - Repeats Your Message\nembed - Repeats You Message As An Embed\nreport <@mention> <reason> - Reports A User To Staff\nroll - Roll the Dice\nversion - Says The Bot's Version\nping - Shows The Bot's Ping\nrestart - Restarts The Bot (Staff Only)\ninvite - Sends Invite Link (Staff Only)\nnick - Sets a user's nickname (Staff ?Only)\nannounce - Sends a message to #news tagging everyone (Staff Only)```");
    }

    // Simple roll the dice command
    if (message.content == config.prefix + "roll") { //command args


        var roll = Math.floor(Math.random() * 6) + 1; //math stuff

        message.reply(" You rolled a " + roll + " !"); //bot replies
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
        message.channel.send(":white_check_mark: " + member + "'s nick has been changed.")
            .then(m => m.delete(5000))
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    

    //announce
    if (message.content.startsWith(config.prefix + "announce")) {
        message.delete();
        let args = message.content.split(" ").slice(1).join(" ");
        if (theirperm >= 3) {
            bot.channels.get('323201519891513345').send("@everyone :loudspeaker: " + args)
            };
        
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    //ban command
    if (message.content.startsWith(config.prefix + "ban")) {
        const member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        if (theirperm >= 3) {
            message.channel.send(":white_check_mark:" + member + " has been banned.");
            member.send(":warning: You have been banned from our server by " + message.author + "\n\nReason:\n```" + args + "```").then(() => {
                member.ban();
            });
        }
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    //ping
    if (message.content.startsWith(config.prefix + "ping")) {
        message.delete(" ");
        message.channel.send(":ping_pong: Pong! " + "``" + (new Date().getTime() - message.createdTimestamp) + "ms" + "``")
            .then(m => m.delete(5000))
    }
    

    //say command
    if (message.content.startsWith(config.prefix + 'say')) {
        let args = message.content.split(" ").slice(1).join(" ");
        message.delete();
        message.channel.send(args);
    }

    //say embed command
    if (message.content.startsWith(config.prefix + 'embed')) {
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
        const member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        if (theirperm >= 3) {
            message.channel.send(":white_check_mark:" + member + " has been kicked.");
            member.send(":warning: You have been kicked from our server by " + message.author + "\n\nReason:\n```" + args + "```").then(() => {
                member.kick();
            });
        }
        if (theirperm <= 3) {
            message.channel.send("Sorry, you aren't able to do that.");
        }
    }

    //report command
    if (message.content.startsWith(config.prefix + "report")) {
        let member = message.mentions.members.first();
        let args = message.content.split(" ").slice(2).join(" ");
        bot.channels.get('345993413688033280').send('<@&342038243308601346>, ' + message.author + ' has reported ' + member + ' for ' + args);
        message.channel.send(':white_check_mark: Sucessfully Reported ' + member + '!')
    }
   
   
    //invite to ur own server
    if (message.content == config.prefix + "invite") {
        if (theirperm >= 3) {
            //you can edit the text here   VVVV   to what u want the bot to say
            message.channel.send(':white_check_mark: Check your DMs!');
            message.author.send({
                embed: {
                    color: 3447003,
                    description: "Invite me from [here](https://discordapp.com/oauth2/authorize?client_id=286684868023287811&scope=bot&permissions=8)"
                }
            }); //https://discordapp.com/oauth2/authorize?client_id=286684868023287811&scope=bot&permissions=8     
        }

        if (theirperm <= 3) {
            //what the bot says if an unauthorized uses says "-restart"
            message.channel.send("Invalid permissions. Only administrators can do that.")
        }
    }

    // Refresh bot (necessary)
    if (message.content == config.prefix + "restart") {
        if (theirperm == 5) {
            //you can edit the text here   VVVV   to what u want the bot to say when its restarting
            message.channel.send(':white_check_mark: Restarting...').then(() => {
				console.log('Restarting bot...');
                process.exitCode = 1;
                process.exit();


            });
        }

        if (theirperm <= 5) {
            //what the bot says if an unauthorized uses says "-restart"
            message.channel.send("Invalid permissions. Only administrators can do that.")
        }
    }

})




//* Startup stuff
bot.login(config.token)
bot.on("ready", function () {
    bot.user.setGame(config.prefix + "help");
    console.log('Bot Ready!');
    bot.channels.get('320651061423636490').send(":ok_hand:  Ready For Commands!")
})
