const Discord = require('discord.js')
const { Client, MessageEmbed } = require("discord.js");
const client = new Client({ disableEveryone: true });
const { TOKEN, prefix, autorole_id, welcome_id, owner, Serverid, Allmembersid, Onlineid } = require('./config');
const moment = require("moment");
const fs = require("fs");


client.on('ready', async () => {

    console.log('THE BOT IS READY')
    client.user.setActivity(`${prefix}help`, { type: "PLAYING" });

//كود الاحصائيات
const guild = client.guilds.cache.get(`${Serverid}`);
const totalUsers = client.channels.cache.get(`${Allmembersid}`);
const onlineUsers = client.channels.cache.get(`${Onlineid}`);

setInterval(function() {

  var userCount = guild.memberCount;
  var onlineCount = guild.members.cache.filter(m => m.presence.status === 'online').size
  
  totalUsers.setName("All Members: " + userCount)
  .catch(console.error);

  onlineUsers.setName("Online: " + onlineCount)
  .catch(console.error);

},10 * 60 * 1000) //تحديد الوقت
//نهاية كود الاحصائيات
});

//امر المساعدة (help)
client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "help")) {
      message.channel
        .send(
          `\`الاوامر العامة\` :postbox:
\`${prefix}help\` : لعرض قائمة المساعدة 
\`${prefix}bot\` : لعرض معلومات عن البوت 
\`${prefix}server\` : لعرض معلومات عن السيرفر 
\`${prefix}user\` : لعرض معلومات عنك 
\`${prefix}avatar\` : لعرض صورتك أو صورة المشار إليه

\`الاوامر الإدارية\` :stars:
\`${prefix}clear\` : لمسح الشات 
\`${prefix}ban\` : لحظر شخص من السيرفر
\`${prefix}kick\` : لطرد شخص من السيرفر
\`${prefix}unlock\` : لفتح الروم
\`${prefix}lock\` : لقفل الروم 
\`${prefix}say\` : الكلام باسم البوت 
\`${prefix}move\` : وضع العضو في روم صوتي محدد 
\`${prefix}vkick\` : لطرد شخص من الروم الصوتي 
\`${prefix}setLog\` : تحديد روم لتسجيل اللوق
\`${prefix}toggleLog\` : تشغبل/ايقاف اللوق `
)

        .then(e => {
          message.react("✅");
        })
      }
    });


//Say امر (say)
client.on("message", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
  
    let args = message.content.split(" ").slice(1);
  
    if (command == "say") {
      if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(
          "**ADMINISTRATOR ليس لديك صلاحيات :rolling_eyes:**"
        );
  
      message.channel.send("" + args.join("  "));
      message.delete();
    }
  });



  // كود معلومات الشخص او اليوزر (user)
client.on("message", pixelbot => {
    if (pixelbot.content.startsWith(prefix + "user")) {
      if (pixelbot.author.bot) return;
      if (!pixelbot.guild)
        return pixelbot.reply("**:x: - This Command is only done on Servers**");
      pixelbot.guild.fetchInvites().then(invites => {
        let personalInvites = invites.filter(
          i => i.inviter.id === pixelbot.author.id
        );
        let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
        var roles = pixelbot.member.roles.cache
          .map(roles => `**__${roles.name}__ |**`)
          .join(` `);
        let pixeluser = new Discord.MessageEmbed() 
          .setColor("#b468fc")
          .setTitle(" :beginner: :heartpulse:   | معلومات العضو") 
          .setAuthor(`${pixelbot.author.username}`, pixelbot.author.avatarURL())
          .addField("**✽ الاسم :**   ", pixelbot.author.username, true)
          .addField("**✽ الرقم :**   ", pixelbot.author.discriminator, true)
          .addField("**✽ الاي دي :** ", pixelbot.author.id, true)
          .addField(
            "**✽ انضم بتاريخ :**   ",
            moment(pixelbot.joinedAt).format("D/M/YYYY h:mm a "),
            true
          )
          .addField(
            "**✽ صنع حسابه بتاريخ :**    ",
            moment(pixelbot.author.createdAt).format("D/M/YYYY h:mm a "),
            true
          )
          .addField("**✽ مجموع الدعوات :**    ", `${inviteCount}`, true)
          .setTimestamp(); 
  
        pixelbot.channel.send(pixeluser).then(c => {}); 
      });
    }
  });



//كود معلومات البوت (bot)
client.on("message", message => {
    if (message.content === prefix + "bot") {
      const bot = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username}`, client.user.avatarURL())
        .setColor("#b468fc")
        .addField(
          "✽ **السرعة** : ",
          `» ${Date.now() - message.createdTimestamp}` + " ms",
          true
        )
        .addField("**السيرفرات** :  ", `» ${client.guilds.cache.size}`, true)
        .addField("**الرومات** : ", `» ${client.channels.cache.size} `, true)
        .addField("**الأعضاء** : ", `» ${client.users.cache.size} `, true)
        .addField("**اسم البوت** :  ", `» ${client.user.username} `, true)
        .addField("**مالك البوت** :  ", `» ${owner}`, true) // تعديل اساسي غير الايدي لايدي حسابك
        .setImage("")
        .setFooter(`${message.author.username}`, message.author.avatarURL())
      message.channel.send(bot);
    }
  });

// امر الباند (ban)
client.on('message', message => {

  if (!message.guild) return;

  if (message.content.startsWith(prefix + "ban")) {
    if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.reply(
      "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"
    );

    const user = message.mentions.users.first();

    if (user) {

      const member = message.guild.members.resolve(user);

      if (member) {
        member
          .ban({
            reason: '',
          })
          .then(() => {
            message.reply(`**لقد تم حظر <@!${user.id}> بنجاح**`);
          })
          .catch(err => {
            message.reply('**لا أستطيع حظر هذا العضو**');
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply("**الرجاء عمل اشارة للشخص المراد حظره**");
    }
  }
});

//امر الطرد (kick)
client.on('message', message => {
  if (!message.guild) return;
  if (message.content.startsWith(prefix + "kick")) {
    if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.reply(
      "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"
    );
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick('')
          .then(() => {
            message.reply(`**لقد تم طرد <@!${user.id}> بنجاح**`);
          })
          .catch(err => {
            message.reply('**لا أستطيع طرد هذا العضو**');
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply("**الرجاء عمل اشارة للشخص المراد طرده**");
    }
  }
});

//مر الصورة (avatar)
client.on('message', message => {
  if (message.content.startsWith(prefix + 'avatar')) {
    const user = message.mentions.users.first() || message.author;
    const avatarEmbed = new Discord.MessageEmbed()
        .setColor("#b468fc")
        .setAuthor(user.tag, user.avatarURL())
        .setImage(user.displayAvatarURL({size: 2048}))
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());
    message.channel.send(avatarEmbed);
  }
});
//امر معلومات عن السيرفر (server)
client.on("message", message => {
  if (message.content.startsWith(prefix + "server")) {
    if (!message.channel.guild)
      return message.channel.send(` | This Command is used only in servers!`);
    const millis = new Date().getTime() - message.guild.createdAt.getTime();
    const now = new Date();
    const verificationLevels = ["None", "Low", "Medium", "Insane", "Extreme"];
    const days = millis / 1000 / 60 / 60 / 24;
    var embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .addField("✽** آيدي السيرفر** :id:", `» ${message.guild.id} `, )
      .addField(
        "✽** صنع بتاريخ** :calendar:",
        `» ${message.guild.createdAt.toLocaleString()}`,
        
      )
      .addField("✽**مالك السيرفر** :crown:", `**${message.guild.owner}**`, )
      .addField(
        `✽** الأعضاء ** [${message.guild.members.cache.size}]`,
        `**${
          message.guild.members.cache.filter(c => c.presence.status !== "offline")
            .size
        }** **متصلين**`,
      )

      .addField(
        "✽** الرومات ** :speech_balloon:",
        ` **${message.guild.channels.cache.filter(m => m.type === "text").size}**` +
          " الكتابية | الصوتية  " +
          `**${message.guild.channels.cache.filter(m => m.type === "voice").size}** `,
        
      )

      .setColor("#b468fc");
    message.channel.send(embed);
  }
});

// كود فتح واغلاق الروم (lock / unlock)
client.on("message", message => {
  if (message.content === prefix + "lock") {
    let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");
    if (!message.channel.guild)
      return message.reply(" هذا الامر فقط للسيرفرات !!");

      if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply(
        "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"
      );

      message.channel.updateOverwrite(everyone, {
        SEND_MESSAGES: false
})

      .then(() => {
        message.reply("**تم قفل الشات :no_entry: **");
      });
  }
  if (message.content === prefix + "unlock") {
    let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");
    if (!message.channel.guild)
      return message.reply(" هذا الامر فقط للسيرفرات !!");

    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply(
        "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"
      );

      message.channel.updateOverwrite(everyone, {
        SEND_MESSAGES: null
})

      .then(() => {
        message.reply("**تم فتح الشات :white_check_mark:**");
      });
  }
});

//امر طرد من الروم الصوتي (vkick)
client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "vkick")) {
    const { Permissions } = require("discord.js");

    if (!message.member.hasPermission("MOVE_MEMBERS"))
    return message.reply(
      "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"  );

    const member = message.mentions.members.first();
    if (!member) return message.reply("**يجب عليك الاشارة للشخص المراد طرده من الروم الصوتي**");
    if (!member.voice.channel) return message.reply("**هذا العضو ليس في روم صوتي**");
    
    member.voice.setChannel(null);
    
    message.react("👌");
  }
  });
//امر نقل عضو الى روم صوتي (move)
  client.on("message", message => {
    if (message.author.bot) return;
  
    let command = message.content.split(" ")[0];
    if (command === prefix + 'move') {
      if (!message.member.permissions.has("MOVE_MEMBERS")) return message.channel.send('**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**');
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const mem = message.mentions.members.first()
      let move = args[1]; // Remember arrays are 0-based!.
      let move2 = args[2];
      let idcheckchannel1 = client.channels.cache.get(move)
      let idcheckchannel2 = client.channels.cache.get(move2)
      if (!args[0]) return message.reply(`**الاستعمال: <ايدي القناة الصوتية> <@العضو> ${prefix}move**`)
      if (!args[1]) return message.reply(`**الاستعمال: <ايدي القناة الصوتية> <@العضو> ${prefix}move**`)
    
      if(args[0] === 'everyone' && !move2) {
        if (!idcheckchannel1) return message.channel.send('**الرجاء وضع ايدي قناة صوتية صحيح**')
        let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
        for (const [memberID, member] of channel.members)
          member.voice.setChannel(`${move}`);
      }
    
      if (mem != null) {
        if (!mem.voice.channel) return message.channel.send('**العضو ليس في قناة صوتية**')
    
        if (!move2) {
          if (!idcheckchannel1) return message.channel.send('**الرجاء وضع ايدي قناة صوتية صحيح**')
          mem.voice.setChannel(`${move}`)
        } else {
          if (!idcheckchannel1) return message.channel.send('**الرجاء وضع ايدي قناة صوتية صحيح**')
          if (!idcheckchannel2) return message.channel.send('**الرجاء وضع ايدي قناة صوتية صحيح**')
          mem.voice.setChannel(`${move}`)
          mem.voice.setChannel(`${move2}`)
        }
      }
    }
  });

//امر حذف الرسائل (clear)
client.on('message', async (message) => {
  if (
    message.content.toLowerCase().startsWith(prefix + 'clear')
  ) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send('**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**');
    if (!isNaN(message.content.split(' ')[1])) {
      let amount = 0;
      if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
        amount = 1;
      } else {
        amount = message.content.split(' ')[1];
        if (amount > 100) {
          amount = 100;
        }
      }

      await message.channel.bulkDelete(amount, true).then((_message) => {
        message.channel.send(      " " +
        "**```fix\n" +
        `${_message.size}` +
        " " +
        ": عدد الرسائل التي تم مسحها" +
        "```**").then((sent) => {
          setTimeout(function () {
            sent.delete();
          }, 5000);
        });
      });
    } else {
      message.channel.send('**الرجاء ادخال عدد الرسائل المراد حذفها**').then((sent) => {
        setTimeout(function () {
          sent.delete();
        }, 5000);
      });
    }
  } 
});
//كود تسجيل اللوق (log)      
const log = JSON.parse(fs.readFileSync("./log.json", "utf8"));
//(setLog)
client.on("message", message => {
  if (!message.channel.guild) return;
  let room = message.content.split(" ").slice(1);
  let findroom = message.guild.channels.cache.find(r => r.name == room);
  if (message.content.startsWith(prefix + "setLog")) {
    if (!message.channel.guild)
      return message.reply("**This Command Only For Servers**");
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
      );
    if (!room) return message.channel.send("Please Type The Channel Name");
    if (!findroom)
      return message.channel.send("Please Type The Log Channel Name");
    let embed = new Discord.MessageEmbed()
      .setTitle("**Done The Log Code Has Been Setup**")
      .addField("Channel:", `${room}`)
      .addField("Requested By:", `${message.author}`)
      .setThumbnail(message.author.avatarURL)
      .setFooter(`${client.user.username}`);
    message.channel.send(embed);
    log[message.guild.id] = {
      channel: room,
      onoff: "On"
    };
    fs.writeFile("./log.json", JSON.stringify(log), err => {
      if (err) console.error(err);
    });
  }
});
//(toggleLog)
client.on("message", message => {
  if (message.content.startsWith(prefix + "toggleLog")) {
    if (!message.channel.guild)
      return message.reply("**This Command Only For Servers**");
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
      );
    if (!log[message.guild.id])
      log[message.guild.id] = {
        onoff: "Off"
      };
    if (log[message.guild.id].onoff === "Off")
      return [
        message.channel.send(`**The log Is __𝐎𝐍__ !**`),
        (log[message.guild.id].onoff = "On")
      ];
    if (log[message.guild.id].onoff === "On")
      return [
        message.channel.send(`**The log Is __𝐎𝐅𝐅__ !**`),
        (log[message.guild.id].onoff = "Off")
      ];
    fs.writeFile("./log.json", JSON.stringify(log), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});

client.on("messageDelete", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[message.guild.id])
    log[message.guild.id] = {
      onoff: "Off"
    };
  if (log[message.guild.id].onoff === "Off") return;
  var logChannel = message.guild.channels.cache.find(
    c => c.name === `${log[message.guild.id].channel}`
  );
  if (!logChannel) return;

  let messageDelete = new Discord.MessageEmbed()
    .setTitle("**[MESSAGE DELETE]**")
    .setColor("RED")
    .setThumbnail(message.author.avatarURL())
    .setDescription(
      `**\n**:wastebasket: Successfully \`\`DELETE\`\` **MESSAGE** In ${message.channel}\n\n**Channel:** \`\`${message.channel.name}\`\` (ID: ${message.channel.id})\n**Message ID:** ${message.id}\n**Sent By:** <@${message.author.id}> (ID: ${message.author.id})\n**Message:**\n\`\`\`${message}\`\`\``
    )
    .setTimestamp()
    .setFooter(message.guild.name, message.guild.iconURL());
  
  logChannel.send(messageDelete);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (!oldMessage.channel.type === "dm") return;
  if (!oldMessage.guild.member(client.user).hasPermission("EMBED_LINKS"))
    return;
  if (!oldMessage.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[oldMessage.guild.id])
    log[oldMessage.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMessage.guild.id].onoff === "Off") return;
  var logChannel = oldMessage.guild.channels.cache.find(
    c => c.name === `${log[oldMessage.guild.id].channel}`
  );
  if (!logChannel) return;

  if (oldMessage.content.startsWith("https://")) return;

  let messageUpdate = new Discord.MessageEmbed()
    .setTitle("**[MESSAGE EDIT]**")
    .setThumbnail(oldMessage.author.avatarURL())
    .setColor("BLUE")
    .setDescription(
      `**\n**:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\` (ID: ${oldMessage.channel.id})\n**Message ID:** ${oldMessage.id}\n**Sent By:** <@${oldMessage.author.id}> (ID: ${oldMessage.author.id})\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``
    )
    .setTimestamp()
    .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL());

  logChannel.send(messageUpdate);
});

client.on("roleCreate", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.cache.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;

  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    let roleCreate = new Discord.MessageEmbed()
      .setTitle("**[ROLE CREATE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`CREATE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL());

    logChannel.send(roleCreate);
  });
});

client.on("roleDelete", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.cache.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;

  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    let roleDelete = new Discord.MessageEmbed()
      .setTitle("**[ROLE DELETE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`DELETE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL());

    logChannel.send(roleDelete);
  });
});

client.on("roleUpdate", (oldRole, newRole) => {
  if (!oldRole.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!oldRole.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[oldRole.guild.id])
    log[oldRole.guild.id] = {
      onoff: "Off"
    };
  if (log[oldRole.guild.id].onoff === "Off") return;
  var logChannel = oldRole.guild.channels.cache.find(
    c => c.name === `${log[oldRole.guild.id].channel}`
  );
  if (!logChannel) return;

  oldRole.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    if (oldRole.name !== newRole.name) {
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateName = new Discord.MessageEmbed()
        .setTitle("**[ROLE NAME UPDATE]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`EDITED\`\` Role Name.\n\n**Old Name:** \`\`${oldRole.name}\`\`\n**New Name:** \`\`${newRole.name}\`\`\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL());

      logChannel.send(roleUpdateName);
    }
    if (oldRole.hexColor !== newRole.hexColor) {
      if (oldRole.hexColor === "#000000") {
        var oldColor = "`Default`";
      } else {
        var oldColor = oldRole.hexColor;
      }
      if (newRole.hexColor === "#000000") {
        var newColor = "`Default`";
      } else {
        var newColor = newRole.hexColor;
      }
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateColor = new Discord.MessageEmbed()
        .setTitle("**[ROLE COLOR UPDATE]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`EDITED\`\` **${oldRole.name}** Role Color.\n\n**Old Color:** ${oldColor}\n**New Color:** ${newColor}\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL());

      logChannel.send(roleUpdateColor);
    }
  });
});

client.on("channelCreate", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.cache.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }

  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    let channelCreate = new Discord.MessageEmbed()
      .setTitle("**[CHANNEL CREATE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`CREATE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL());

    logChannel.send(channelCreate);
  });
});

client.on("channelDelete", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.cache.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }

  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    let channelDelete = new Discord.MessageEmbed()
      .setTitle("**[CHANNEL DELETE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`DELETE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL());

    logChannel.send(channelDelete);
  });
});
client.on("channelUpdate", (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (!log[oldChannel.guild.id])
    log[oldChannel.guild.id] = {
      onoff: "Off"
    };
  if (log[oldChannel.guild.id].onoff === "Off") return;
  var logChannel = oldChannel.guild.channels.cache.find(
    c => c.name === `${log[oldChannel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (oldChannel.type === "text") {
    var channelType = "Text";
  } else if (oldChannel.type === "voice") {
    var channelType = "Voice";
  } else if (oldChannel.type === "category") {
    var channelType = "Category";
  }

  oldChannel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    if (oldChannel.name !== newChannel.name) {
      let newName = new Discord.MessageEmbed()
        .setTitle("**[CHANNEL EDIT]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:wrench: Successfully Edited **${channelType}** Channel Name\n\n**Old Name:** \`\`${oldChannel.name}\`\`\n**New Name:** \`\`${newChannel.name}\`\`\n**Channel ID:** ${oldChannel.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL());

      logChannel.send(newName);
    }
    if (oldChannel.topic !== newChannel.topic) {
      if (log[oldChannel.guild.id].onoff === "Off") return;
      let newTopic = new Discord.MessageEmbed()
        .setTitle("**[CHANNEL EDIT]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:wrench: Successfully Edited **${channelType}** Channel Topic\n\n**Old Topic:**\n\`\`\`${oldChannel.topic ||
            "NULL"}\`\`\`\n**New Topic:**\n\`\`\`${newChannel.topic ||
            "NULL"}\`\`\`\n**Channel:** ${oldChannel} (ID: ${
            oldChannel.id
          })\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL());

      logChannel.send(newTopic);
    }
  });
});


client.on("guildBanAdd", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[guild.id])
    log[guild.id] = {
      onoff: "Off"
    };
  if (log[guild.id].onoff === "Off") return;
  var logChannel = guild.channels.cache.find(
    c => c.name === `${log[guild.id].channel}`
  );
  if (!logChannel) return;

  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    if (userID === client.user.id) return;

    let banInfo = new Discord.MessageEmbed()
      .setTitle("**[BANNED]**")
      .setThumbnail(userAvatar)
      .setColor("DARK_RED")
      .setDescription(
        `**\n**:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL());

    logChannel.send(banInfo);
  });
});

client.on("guildBanRemove", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[guild.id])
    log[guild.id] = {
      onoff: "Off"
    };
  if (log[guild.id].onoff === "Off") return;
  var logChannel = guild.channels.cache.find(
    c => c.name === `${log[guild.id].channel}`
  );
  if (!logChannel) return;

  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();

    if (userID === client.user.id) return;

    let unBanInfo = new Discord.MessageEmbed()
      .setTitle("**[UNBANNED]**")
      .setThumbnail(userAvatar)
      .setColor("GREEN")
      .setDescription(
        `**\n**:unlock: Successfully \`\`UNBANNED\`\` **${user.username}** From the server\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL());

    logChannel.send(unBanInfo);
  });
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (!oldMember.guild) return;
  if (!log[oldMember.guild.id])
    log[oldMember.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMember.guild.id].onoff === "Off") return;
  var logChannel = oldMember.guild.channels.cache.find(
    c => c.name === `${log[(oldMember, newMember.guild.id)].channel}`
  );
  if (!logChannel) return;

  oldMember.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
    var userTag = logs.entries.first().executor.tag;

    if (oldMember.nickname !== newMember.nickname) {
      if (oldMember.nickname === null) {
        var oldNM = "`اسمه الاصلي`";
      } else {
        var oldNM = oldMember.nickname;
      }
      if (newMember.nickname === null) {
        var newNM = "`اسمه الاصلي`";
      } else {
        var newNM = newMember.nickname;
      }

      let updateNickname = new Discord.MessageEmbed()
        .setTitle("**[UPDATE MEMBER NICKNAME]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:spy: Successfully \`\`CHANGE\`\` Member Nickname.\n\n**User:** ${oldMember} (ID: ${oldMember.id})\n**Old Nickname:** ${oldNM}\n**New Nickname:** ${newNM}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldMember.guild.name, oldMember.guild.iconURL());

      logChannel.send(updateNickname);
    }
    if (oldMember.roles.size < newMember.roles.size) {
      let role = newMember.roles
        .filter(r => !oldMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[oldMember.guild.id].onoff === "Off") return;
      let roleAdded = new Discord.MessageEmbed()
        .setTitle("**[ADDED ROLE TO MEMBER]**")
        .setThumbnail(oldMember.guild.iconURL())
        .setColor("GREEN")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`ADDED\`\` Role to **${oldMember.user.username}**\n\n**User:** <@${oldMember.id}> (ID: ${oldMember.user.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(roleAdded);
    }
    if (oldMember.roles.size > newMember.roles.size) {
      let role = oldMember.roles
        .filter(r => !newMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
      let roleRemoved = new Discord.MessageEmbed()
        .setTitle("**[REMOVED ROLE FROM MEMBER]**")
        .setThumbnail(oldMember.guild.iconURL())
        .setColor("RED")
        .setDescription(
          `**\n**:negative_squared_cross_mark: Successfully \`\`REMOVED\`\` Role from **${oldMember.user.username}**\n\n**User:** <@${oldMember.user.id}> (ID: ${oldMember.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(roleRemoved);
    }
  });
  if (oldMember.guild.owner.id !== newMember.guild.owner.id) {
    if (!log[oldMember.guild.id])
      log[oldMember.guild.id] = {
        onoff: "Off"
      };
    if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
    let newOwner = new Discord.MessageEmbed()
      .setTitle("**[UPDATE GUILD OWNER]**")
      .setThumbnail(oldMember.guild.iconURL())
      .setColor("GREEN")
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`TRANSFER\`\` The Owner Ship.\n\n**Old Owner:** <@${oldMember.user.id}> (ID: ${oldMember.user.id})\n**New Owner:** <@${newMember.user.id}> (ID: ${newMember.user.id})`
      )
      .setTimestamp()
      .setFooter(oldMember.guild.name, oldMember.guild.iconURL());

    logChannel.send(newOwner);
  }
});
//نهاية كود تسجيل اللوق (log end)


/////كود سرعة البوت او البينق (ping)
client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "ping")) {
    if (message.author.bot) return;
    if (!message.channel.guild) return;
    var Bping = `${Math.round(message.client.ws.ping) }`;

    const E1ping = new Discord.MessageEmbed()
      .setTitle("ــــــــــــــــــــــــــــــ")
      .addField(
        `**متوسط السرعة :** :__${Bping} ms__`,
        "ــــــــــــــــــــــــــــــ"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#b468fc");
    message.channel.send(E1ping);
  }
});


//امر الكتم (mute)
client.on("message", async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if (message.content.startsWith(prefix + "mute")) {
if (!message.member.hasPermission("MANAGE_ROLES")) {
  return message.channel.send("sorry you need permission to mute someone");
}
if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
  return message.channel.send("I do not have permission to mute");
}

const user = message.mentions.members.first();

if (!user) {
  return message.channel.send("\```please mention the members for mute\```");
}
if (user.id === message.author.id) {
  return message.channel.send("I can't mute you because you are message author");
}
let reason = args.slice(1).join("");

if (!reason) {
  return message.channel.send(" \``` please give some reason for mute\``` ");
}

const vrole = user.roles.cache

let muterole = message.guild.roles.cache.find(x => x.name === "Muted");

if (!muterole) {
  return message.channel.send("\```please create role name with muted \``` ");
}

await user.roles.remove(vrole);
await user.roles.add(muterole);

await message.channel.send(
  `you muted ${message.mentions.users.first().username} for ${reason}`
);

user.send(`You get muted in ${message.guild} for ${reason}`
);
}
});


//امر إالغاء الكتم (unmute)
client.on("message", async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if (message.content.startsWith(prefix + "unmute")) {
if (!message.member.hasPermission("MANAGE_ROLES")) {
  return message.channel.send(
    "Sorry but you do not have permission to unmute anyone"
  );
}

if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
  return message.channel.send("I do not have permission to manage roles.");
}

const user = message.mentions.members.first();

if (!user) {
  return message.channel.send("Please mention the member to who you want to unmute");
}

let muterole = message.guild.roles.cache.find(x => x.name === "Muted");
let member = message.guild.roles.cache.find(x => x.name === "»⌠Members⌡");

if (user.roles.cache.has(muterole)) {
  return message.channel.send("Given User do not have mute role so what i am suppose to take");
}

user.roles.remove(muterole)
await user.roles.add(member);

await message.channel.send(`**${message.mentions.users.first().username}** is now unmuted`);

user.send(`You are now unmuted from **${message.guild.name}**`);

message.delete()
}
});

//امر ايقاف تشغيل البوت (shutdown)
client.on("message", async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if (message.content.startsWith(prefix + "shutdown")) {
if (message.author.id != `${owner}`) {
  return message.channel.send("The Commands Only Owner")
    }
await message.channel.send(`☑️ Bot is now turned off !!`)
    process.exit()
}
});

//امر ابطاء الشات (slowmode)
client.on("message", async (message) => {
    if(!message.content.startsWith(prefix + "slowmode")) return
    const messageArray = message.content.split(' ');
    const args = messageArray.slice(1);
        if(!message.member.hasPermission('MANAGE_MESSAGES')) 
        return message.channel.send("You need `MANAGE_MESSAGES` permission to execute this command.");
  if(args[0] > 21600) {
      args[0] = 21600;
  }
  if(args[0] < 0) {
    args[0] = 0;
  }
  if(isNaN(args[0])){
    return message.channel.send("**الرجاء إدخال الوقت**")
  }
      message.channel.setRateLimitPerUser(args[0]);
    message.channel.send(`Slowmode has been set to: ${args[0]} Seconds`)
});


//كود الترحيب (welcome)
client.on('guildMemberAdd', member => {
  member.roles.add(member.guild.roles.cache.find(i => i.id === autorole_id))
    
//  const welcomeEmbed = new Discord.MessageEmbed()
//
//  welcomeEmbed.setColor('#b468fc')
//  welcomeEmbed.setTitle('**' + member.user.tag + '** is now Among Us other **' + member.guild.memberCount + '** people')
//  welcomeEmbed.setImage('https://cdn.mos.cms.futurecdn.net/93GAa4wm3z4HbenzLbxWeQ-650-80.jpg.webp')

  const wel = member.guild.channels.cache.find(i => i.id === welcome_id)
  wel.send(`مرحبا بك يا <@${member.user.id}> لا تنسى قراءة القوانين
  `,{files: ['./Welcome/Banner.webp']});
});

//مينشن لجميع البوتات في السيرفر (botmenu)
client.on("message", message => {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
  return message.reply(
    "**ليس لديك الصلاحيات الكافية لاستخدام هذا الأمر :rolling_eyes:**"
  );
  if (message.content === prefix + "botmenu") {
    var list_all = [];
    message.guild.members.cache.forEach(bb => {
      if (!bb.user.bot) return;
      list_all.push(`<@${bb.user.id}>`);
    });
    message.channel.send(list_all.join(", "));
  }
});

//انشاء رابط (link)
client.on("message", message => {
  if (message.content.split(" ")[0] === prefix + "link") {
    message.channel
      .createInvite({
        thing: true,
        maxUses: 5,
        maxAge: 86400
      })
      .then(invite => message.author.send(invite.url));
    const embed = new Discord.MessageEmbed()
      .setColor("#b468fc")
      .setDescription(
        "** تم ارسال الرابط على الخاص ، اذا لم يصلك افتح الخاص  **"
      )
      .setAuthor(client.user.username, client.user.avatarURL())
      .setAuthor(client.user.username, client.user.avatarURL())
      .setFooter("طلب بواسطة: " + message.author.tag);

    message.channel.send(embed).then(message => {
      message.delete({ timeout: 10000});
    });
    const Embed11 = new Discord.MessageEmbed().setColor("#b468fc")
      .setDescription(`** مدة الرابط : يوم 
 عدد استخدامات الرابط : 5 **`);

    message.author.send(Embed11);
  }
});





client.login(`${TOKEN}`)






