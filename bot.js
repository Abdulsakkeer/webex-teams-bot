const WebexChatBot = require("node-sparkbot");
const bot = new WebexChatBot();

const SparkAPIWrapper = require("node-sparkclient");
if (!process.env.ACCESS_TOKEN) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please add env variable ACCESS_TOKEN on the command line");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX DEBUG=sparkbot* node helloworld.js");
    process.exit(1);
}
const client = new SparkAPIWrapper(process.env.ACCESS_TOKEN);

const csv = require('csv-parser')
const fs = require('fs')
const results = [];

var data = {}
fs.createReadStream('data.csv')
  .pipe(csv({headers: ['key', 'value']}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(function(item, index){
        data[item['key'].toLowerCase()] = item['value'];
    });
});

bot.onCommand("hello", function (command) {
    message = command.args.join(' ').toLowerCase()

    if (message == "") {
        client.createMessage(command.message.roomId, "Hello, how can I help you?", { "markdown":true }, function(err, response) {
            if (err) {
                console.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
                return;
            }
        });
    } else {

        if (data[message] == undefined){
            client.createMessage(command.message.roomId, "Sorry, I did not understand", { "markdown":true }, function(err, response) {
                if (err) {
                    console.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
                    return;
                }
            });

        } else {
            client.createMessage(command.message.roomId, data[message], { "markdown":true }, function(err, response) {
                if (err) {
                    console.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
                    return;
                }
            });
        }
    }
});
