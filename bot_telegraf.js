"use strict";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const pokemon = require("./app/pokemon.min.json");

const CONFIG = require("./app/config/config");
// const morgan = require('morgan')
// const createError = require('http-errors')
const bodyParser = require("body-parser");

const Telegraf = require("telegraf");
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN || "";
const bot = new Telegraf(TELEGRAM_API_TOKEN);

//https://www.pokemon.com/us/api/pokedex/kalos

// check if id_or_name matches a pokemon's id or name
const match = (pokemon, id_or_name) =>
  pokemon.id == id_or_name || pokemon.slug.includes(id_or_name.toLowerCase());

// find the first matching pokemon
const get_pokemon = (id_or_name) => pokemon.find((p) => match(p, id_or_name));

// find all matching pokemon
function* find_pokemon(id_or_name) {
  for (const p of pokemon) {
    if (match(p, id_or_name)) yield p;
  }
}

const App = express();
App.use(bodyParser.json());
// App.use(morgan('dev'))
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.get("/", (req, res, next) => {
  // console.log(req.body);

  res.send("INDEX cambiooooo");
});

App.post("/webhooks/telegram", (req, res, next) => {
  console.log(req.body);

  res.send({ status: "ok" });
});

const isNumeric = (num) =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num);

// App.use(bot.webhookCallback('/webhooks/telegram'))
// bot.telegram.setWebhook('process.env.WEBHOOK')
bot.use((ctx, next) => {
  //ctx.reply('usaste el bot');
  // next();
  // console.log(ctx.update);
  // console.log("Chat ",ctx.update.message.chat);
  console.log("Texto Pokemon: ", ctx.update.message.text);

  if (!isNumeric(ctx.update.message.text)) {
    ctx.reply("Only number");
    return;
  }
  //console.log(ctx.botInfo);

  // populate an array of inline query results
  const results = [];

  const data = get_pokemon(ctx.update.message.text);

  const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1); // capitalise a word
  const format_type = (pokemon) => pokemon.type.map(capitalise).join("/"); // join multiple types into one word
  const format_height = (height) =>
    `${Math.floor(height / 12)}' ${height % 12}"`; // display height in feet and inches

  // format pokemon data as a text string to use in a message
  const format_text = (pokemon) => `*${pokemon.name} (#${pokemon.number})*
                            Type: ${format_type(pokemon)}
                            Abilities: ${pokemon.abilities.join(", ")}
                            Height: ${format_height(pokemon.height)}
                            Weight: ${pokemon.weight} lbs
                            [Image](${pokemon.ThumbnailImage.replace("detail", "full")})`; // higher res image

  // ctx.reply(data);
  ctx.replyWithMarkdown(format_text);

  ctx.state.users = 75;
  next(ctx); //next is passed because we can modify data
});

bot.start((ctx) => {
  // ctx.reply('Welcome');
  // console.log(ctx)
  // console.log(ctx.from)
  // console.log(ctx.chat)
  // console.log(ctx.message)
  // console.log(ctx.updateSubTypes)
  console.log(ctx.updateSubTypes[0]);

  // ctx.reply(`Welcome ${ctx.from.first_name} ${ctx.from.last_name}`)
  // ctx.reply(`Total Users: ${ctx.state.users}`) // shurtcuts does not require id

  // shortcuts avoid to write the following
  // bot.telegram.sendMessage(ctx.chat.id, 'hello world', [extra]);
  bot.telegram.sendMessage(ctx.chat.id, "hello world");
  // bot.telegram.sendMessage(ctx.chat.id, '**hello world**', {
  //   parse_mode: 'Markdown',
  //   disable_notification: true
  // });
});

bot.help((ctx) => ctx.reply("help command"));

bot.settings((ctx) => ctx.reply("settings command"));

// Custom Command
// to avoid case sensitive commando you can put in an array some variations
bot.command(["mytest", "Mytest", "test"], (ctx) => {
  ctx.reply("my custom command");
});

// hears
// This wont work on groups, so you will have to turn off 'privacy group'
bot.hears("computer", (ctx) => {
  ctx.reply("Hey I am selling a computer!!!");
});

// bot.on('text', ctx => {
//   ctx.reply('text message');
// });

// bot.on('sticker', ctx => {
//   ctx.reply('oh! you like stickers')
// })

// this methods can be recognized inside a long text
bot.mention("BotFather", (ctx) => {
  ctx.reply("you mentioned someone");
});

bot.phone("+1 730 263-4233", (ctx) => {
  ctx.reply("this is a phone");
});

bot.hashtag("coding", (ctx) => {
  ctx.reply("hashtag!");
});

App.listen(CONFIG.PORT, function (error) {
  if (error) return console.log(error);
  console.log(`Servidor corriendo en el Puerto: ${CONFIG.HOST}:${CONFIG.PORT}`);
});

bot.launch();
