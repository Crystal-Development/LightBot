
//* made by: iFractal

//GO TO LINE 234 TO SET WHAT THE BOT IS PLAYING!

//PUT YOUR BOTS TOKEN IN THE CONFIG.JSON FILE

// PREFIX/VERSION IS ALSO IN THE CONFIG.JSON

// How to make role permissions:
// Ex: if(theirperm>=4){            <--(head admins and up. Details: Owner(you) = 5;Head Admin = 4; Admins = 3; Mods = 2; Members+ = 1; Regular people (@everyone) = 0.)
//      stuff happens here!
//                    }             <--(remember close it off with a bracket)


//DONT TOUCH THIS VVVV

var Discord = require("discord.js");


var bot = new Discord.Client();

const config = require("./config.json");

//*   Perms
function GetPermissionLevel(user) {
    var guildmemberobject = true;
    if(typeof(user.guild) == "undefined") {
        guildmemberobject = false;
    }
    var presumed_rank = 0;


    if(guildmemberobject == true) {
        if(user.guild.owner == user) {
            presumed_rank = 5;
            // Owner
          //  (you can edit perms if you know how too)
          } else {
              if(user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_CHANNELS") || user.hasPermission("MANAGE_GUILD")  || user.hasPermission("BAN_MEMBERS")) {
                  presumed_rank = 4;
                  // Head Administrator
        } else {
            if(user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_CHANNELS") || user.hasPermission("MANAGE_GUILD")) {
                presumed_rank = 3;
                // Administrator
            } else {
                if(user.hasPermission("KICK_MEMBERS") || user.hasPermission("MANAGE_MESSAGES") || user.hasPermission("MANAGE_NICKNAMES")) {
                    presumed_rank = 2;
                    // Moderator
                } else {
                    if(user.hasPermission("EMBED_LINKS") || user.hasPermissions("ATTACH_FILES") || user.hasPermission("SEND_TTS_MESSAGES") || user.hasPermission("CHANGE_NICKNAME")) {
                        presumed_rank = 1;
                        // Previleged
                    } else {
                      if(user.hasPermissions("READ_MESSAGES")) {
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
bot.on("message",message => {
 if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
command = command.slice(config.prefix.length);

let args = message.content.split(" ").slice(1);





  message.guild.members.forEach(function(member) {
    if(String(member.user.id) == String(message.author.id)) {
     guildmem = member;
  }
  });
  if(typeof(guildmem) !== "undefined") {
  var theirperm = GetPermissionLevel(guildmem);
}


// Simple roll the dice command



if(message.content == config.prefix + "roll"){ //command args


var roll = Math.floor(Math.random() * 6) + 1; //math stuff

  message.reply(" You rolled a " + roll + " !"); //bot replies
}

// Version command

if(message.content == config.prefix + "version"){

  message.reply(config.version);
}


// Refresh bot (necessary)



if(message.content == config.prefix + "restart") {
if(theirperm == 5) {
  //you can edit the text here   VVVV   to what u want the bot to say when its restarting
    message.channel.send(':ok_hand: :sleeping: Restarting...').then(() => {
        process.exitCode = 1;
        process.exit();


    });
}

if(theirperm <= 4) {
  //what the bot says if an unauthorized uses says "-restart"
    message.channel.send("I'm sorry, " + message.author + ". I'm afriad I can't let you do that.")
}



}



});
//* Startup stuff
bot.login(config.token)
bot.on("ready",function() {
bot.user.setGame(config.prefix + "set what the bot is playing");

});