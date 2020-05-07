// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const Discord = require("discord.js"); // Code below supports and is tested under "stable" 11.3.x
const client = new Discord.Client();
const prefix = ";";
const roblox = require("noblox.js");
// end discord.js init

// Initialize **or load** the points database.
const Enmap = require("enmap");
client.points = new Enmap({ name: "points" });

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(
    `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
  );
  client.user.setActivity("over the TCA", { type: "WATCHING" });
  function login() {
    return roblox.cookieLogin(process.env.COOKIE);
  }

  login() // Log into ROBLOX
    .then(function() {
      // After the function has been executed
      console.log("Logged in."); // Log to the console that we've logged in
    })
    .catch(function(error) {
      // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
      console.log(`Login error: ${error}`); // Log the error to console if there is one.
    });
});

client.on("message", async message => {
  // First, ignore itself and all other bots. Also, ignore private messages so a user can't spam the bot for points.
  if (!message.guild || message.author.bot) return;

  /* Now we start the real code for this tutorial */

  // If this is not in a DM, execute the points code.
  if (message.guild) {
    // We'll use the key often enough that simplifying it is worth the trouble.
    const key = `${message.guild.id}-${message.author.id}`;

    // Triggers on new users we haven't seen before.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      lastSeen: new Date()
    });
  }

  /* END POINTS ATTRIBUTION. Now let's have some fun with commands. */

  // As usual, we stop processing if the message does not start with our prefix.
  if (message.content.indexOf(prefix) !== 0) return;

  // Also we use the config prefix to get our arguments and command:
  const args = message.content.split(/\s+/g);
  const command = args
    .shift()
    .slice(prefix.length)
    .toLowerCase();

  // Let's build some useful ones for our points system.

  if (command === "points") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    const key = `${message.guild.id}-${message.author.id}`;
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      lastSeen: new Date()
    });
    const pointsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("Points")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setDescription(
        `${message.author.tag} currently has ${client.points.get(
          key,
          "points"
        )} points.`
      )
      .setFooter(
        `Made by Phosphorus_Carbide`,
        "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
      );
    message.channel.send(pointsEmbed);
  }

  if (command === "checkpoints") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    let member = message.mentions.users.first();
    const key = `${message.guild.id}-${member.id}`;
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      lastSeen: new Date()
    });
    const pointsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("Points")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setDescription(
        `${member.tag} currently has ${client.points.get(
          key,
          "points"
        )} points.`
      )
      .setFooter(
        `Made by Phosphorus_Carbide`,
        "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
      );
    message.channel.send(pointsEmbed);
  }

  if (command === "give") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.author.hoistRole.hexColor;
    // Limited to guild owner - adjust to your own preference!
    if (
      !message.member.roles.cache.some(r => ["points-perms"].includes(r.name))
    )
      return message.reply("You can't use this command.");

    const user = message.mentions.users.first() || client.users.get(args[0]);
    if (!user)
      return message.reply("You must mention someone or give their ID!");

    const pointsToAdd = parseInt(args[1], 10);
    if (!pointsToAdd)
      return message.reply("You didn't tell me how many points to give...");

    const key = `${message.guild.id}-${user.id}`;

    // Ensure there is a points entry for this user.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      lastSeen: new Date()
    });

    // Add the points to the enmap for this user.
    client.points.math(key, "+", pointsToAdd, "points");

    const pointsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("Points")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setThumbnail(
        "https://getdrawings.com/free-icon/android-checkmark-icon-60.png"
      )
      .setDescription(
        `Done! ${
          user.tag
        } has received ${pointsToAdd} points and now stands at ${client.points.get(
          key,
          "points"
        )} points.`
      )
      .setFooter(
        `Made by Phosphorus_Carbide`,
        "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
      );
    message.channel.send(pointsEmbed);
  }

  if (command === "remove") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    // Limited to guild owner - adjust to your own preference!
    if (
      !message.member.roles.cache.some(r => ["points-perms"].includes(r.name))
    )
      return message.reply("You can't use this command.");

    const user = message.mentions.users.first() || client.users.get(args[0]);
    if (!user)
      return message.reply("You must mention someone or give their ID!");

    const pointsToAdd = parseInt(args[1], 10);
    if (!pointsToAdd)
      return message.reply("You didn't tell me how many points to give...");

    const key = `${message.guild.id}-${user.id}`;

    // Ensure there is a points entry for this user.
    client.points.ensure(key, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      lastSeen: new Date()
    });

    // Add the points to the enmap for this user.
    client.points.math(key, "-", pointsToAdd, "points");

    const pointsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("Points")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setThumbnail(
        "https://getdrawings.com/free-icon/android-checkmark-icon-60.png"
      )
      .setDescription(
        `Done! ${
          user.tag
        } has lost ${pointsToAdd} points and now stands at ${client.points.get(
          key,
          "points"
        )} points.`
      )
      .setFooter(
        `Made by Phosphorus_Carbide`,
        "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
      );
    message.channel.send(pointsEmbed);
  }

  if (command === "help") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    const helpEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("Help")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .addFields(
        { name: ";help", value: "Shows this embed." },
        { name: ";give", value: "Give a user points." },
        { name: ";remove", value: "Remove a user's points." },
        { name: ";points", value: "Check your points." },
        { name: ";checkpoints", value: "Check another user's points." },
        {
          name: ";promo <username>",
          value: "Be promoted in the ROBLOX group."
        },
        {
          name: ";fpromo <ping> <username>",
          value: "Force promote someone in the ROBLOX group."
        }
      )
      .setFooter(
        `Made by Phosphorus_Carbide`,
        "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
      );
    message.channel.send(helpEmbed);
  }
  if (command === "cleanup") {
    // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    const filtered = client.points.filter(p => p.guild === message.guild.id);

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
      return (
        !message.guild.users.has(data.user) ||
        rightNow - 2592000000 > data.lastSeen
      );
    });

    toRemove.forEach(data => {
      client.points.delete(`${message.guild.id}-${data.user}`);
    });
    message.channel.send(`I've cleaned up ${toRemove.size} old farts.`);
  }
  if (command === "promo") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    if (!message.guild == 692066453033320499) return;
    let groupId = 5181288;
    let username = args[0];
    if (!username) return message.channel.send("Please enter a username.");
    const key = `${message.guild.id}-${message.author.id}`;
    let points = client.points.get(key, "points");
    const id = await roblox.getIdFromUsername(username);
    const curRank = await roblox.getRankInGroup(groupId, id);
    if (curRank > 8)
      return message.channel.send(
        "Your rank is already higher than what you are requesting."
      );
    if (points < 2) {
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Sorry, you are not eligible for a promotion, leaving you at [E-1] Enlist.`)
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      roblox.setRank({ group: groupId, target: id, rank: 1 });
      message.channel.send(promoEmbed)
    }
    if (points >= 2 && points < 10) {
      roblox.setRank({ group: groupId, target: id, rank: 2 });
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-2] Private. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 10 && points < 15) {
      roblox.setRank(groupId, id, 3);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-3] Private First Class. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 15 && points < 25) {
      roblox.setRank(groupId, id, 4);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-4] Lance Corporal. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 25 && points < 40) {
      roblox.setRank(groupId, id, 5);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-5] Corporal. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 40 && points < 60) {
      roblox.setRank(groupId, id, 6);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-1] Sergeant. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 60 && points < 80) {
      roblox.setRank(groupId, id, 7);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-2] Staff Sergeant. Congrats, soldier. Be sure to do !getroles to get your role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points == 80 || points > 80) {
      roblox.setRank(groupId, id, 8);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-3] Sergeant Major. Congrats, soldier. Be sure to do !getroles to get your role. Please read <#693548897913536533>.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
  }
  if (command === "fpromo") {
    let color = message.member.displayHexColor;
    if (color == '#000000') color = message.member.hoistRole.hexColor;
    if (
      !message.member.roles.cache.some(r => ["points-perms"].includes(r.name))
    )
      return message.reply("You can't use this command.");
    let groupId = 5181288;
    let user = message.mentions.users.first();
    let username = args[1];
    if (!message.mentions) return message.channel.send('Please ping someone so I can check their points.')
    if (!username) return message.channel.send("Please enter a username.");
    const key = `${message.guild.id}-${user.id}`;
    let points = client.points.get(key, "points");
    const id = await roblox.getIdFromUsername(username);
    const curRank = await roblox.getRankInGroup(groupId, id);
    if (curRank > 8)
      return message.channel.send(
        "That person's rank is already higher than what you are requesting."
      );
    if (points < 2) {
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Sorry, ${username} is not eligible for a promotion, leaving them at [E-1] Enlist.`)
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      roblox.setRank({ group: groupId, target: id, rank: 1 });
      message.channel.send(promoEmbed)
    }
    if (points >= 2 && points < 10) {
      roblox.setRank({ group: groupId, target: id, rank: 2 });
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-2] Private. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 10 && points < 15) {
      roblox.setRank(groupId, id, 3);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-3] Private First Class. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 15 && points < 25) {
      roblox.setRank(groupId, id, 4);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-4] Lance Corporal. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 25 && points < 40) {
      roblox.setRank(groupId, id, 5);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [E-5] Corporal. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 40 && points < 60) {
      roblox.setRank(groupId, id, 6);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-1] Sergeant. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points >= 60 && points < 80) {
      roblox.setRank(groupId, id, 7);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-2] Staff Sergeant. Congrats to that soldier. Be sure to have them do !getroles to get their role.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
    if (points == 80 || points > 80) {
      roblox.setRank(groupId, id, 8);
      const promoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Points")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `${username} was promoted to [N-3] Sergeant Major. Congrats to that soldier. Be sure to have them do !getroles to get their role. Please have them read <#693548897913536533>.`
        )
        .setFooter(
          `Made by Phosphorus_Carbide`,
          "https://cdn.discordapp.com/avatars/294291918022508547/28c740d2370e117a4b74dcb3df117f3b.png?size=128"
        );
      message.channel.send(promoEmbed);
    }
  }
});


// Start the bot by logging it in.
client.login(process.env.TOKEN);
