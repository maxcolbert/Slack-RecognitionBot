
/*

// ============ Imp Links & Info ============ //

How to get running:
Set up Ngrok & must also set up a localhost running
Ensure that slack api is set to Ngrok tunnel url

- Using ngrok:
status: http://localhost:4040/inspect/http
docs: https://ngrok.com/docs
instrs: https://dashboard.ngrok.com/get-started
download and then put the terminal file in base directory
./ngrok authtoken <YOUR_AUTH_TOKEN>
./ngrok http 3000

- Set up localhost on port 3000:
http-server -a localhost -p 3000 -c1
OR
node server.js

- Starter Tutorial (plus code):
https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b
https://github.com/bmorelli25/simple-nodejs-weather-app

- Starter Project Code:
https://expressjs.com/en/starter/hello-world.html

- Page Routing in ExpressJS:
https://www.mydatahack.com/website-page-routing-with-node-js-express-and-ejs/

- Routing Tutorial in ExpressJS:
https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers

- Embedding JS into HTML using EJS:
HTML contains embedded JS via opening and closing brackets: <% CODE HERE %> which is similar to <% if(weather !== null){ %>

- Embedding HTML Files into HTML usnig EJS:
insert <% include ./include/head %> for instance to include a file named header with html code in it

- ExpressJS Routing:
https://expressjs.com/en/guide/routing.html
https://www.mydatahack.com/website-page-routing-with-node-js-express-and-ejs/

- Other EJS Info/Tutorials:
https://shockoe.com/blog/creating-dynamic-web-pages-ejs/

- EJS Home Page:
https://ejs.co/

- Installing Libraries:
Always use this format
npm install LIBRARY --save

- How to run the code:
CD into the project directory and run
node server.js

- How to remove unused CSS:
https://www.keycdn.com/blog/remove-unused-css

- Flex Containers:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container

- Sample Code for centering items:
https://css-tricks.com/centering-css-complete-guide/
https://philipwalton.github.io/solved-by-flexbox/demos/vertical-centering/
https://www.w3schools.com/cssref/tryit.asp?filename=trycss3_justify-content

- Top Navigation Sample:
https://www.w3schools.com/howto/howto_js_topnav.asp

- Installed Dependencies:
npm install --save express
npm install ejs --save
npm install body-parser --save
npm install technicalindicators --save
npm install tulind --save
npm install node-schedule --save
npm install request --save
blanket install: npm install

*/


// ============ SET UP ============ //

require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

const payloads = require('./scripts/payloads');
const signature = require('./scripts/verifySignature');
const api = require('./scripts/api');

var index = require('./routes/index');
var users = require('./routes/users');
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

// contains all indicator functionality
// var indjs = require('./routes/indicators');

// unirest to make data requests
// web: http://unirest.io/nodejs.html
// var unirest = require('unirest');

// https://www.npmjs.com/package/node-schedule
// var schedule = require('node-schedule');

const app = express()
// const router = express.Router();
// const port = 3000

// =================== PARSER =================== //

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));

// =================== PUBLIC =================== //

// allows us to access all of the static files within the ‘public’ folder
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// =================== VIEW =================== //

// respond with an HTML file, using EJS, allows us to interact with variables and then dynamically create our HTML based on those variables
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

// =================== FAVICON =================== //

app.use('/favicon.ico', express.static('public/images/favicon.ico'));

//==== ROUTES ====//
app.get('/', (req, res) => {
  res.send('<h2>The Approval Flow app is running</h2> <p>Follow the' +
    ' instructions in the README to configure the Slack App and your' +
    ' environment variables.</p>');
});

/*
 * Endpoint to receive events from Slack's Events API.
 * It handles `message.im` event callbacks.
 */

app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      return res.send({ challenge: req.body.challenge });
    }
    case 'event_callback': {
      // Verify the signing secret
      if (!signature.isVerified(req)) return res.status(400).send();

      const event = req.body.event;
      // ignore events from bots
      if (event.bot_id) return res.status(200).send();

      handleEvent(event);
      return res.status(200).send();
    }
    default:
      return res.status(404).send();
  }
});

/*
 * Endpoint to receive events from interactive message and a dialog on Slack. 
 * Verify the signing secret before continuing.
 */
app.post('/interactions', async (req, res) => {
  if (!signature.isVerified(req)) return res.status(400).send();

  const payload = JSON.parse(req.body.payload);
  // console.log("PAYLOAD: ", payload)

  if (payload.type === 'block_actions') {
    // acknowledge the event before doing heavy-lifting on our servers
    res.status(200).send();

    let action = payload.actions[0]

    switch (action.action_id) {
      case 'make_recognition':
        // await api.openRequestModal(payload.trigger_id);
        await api.callAPIMethodPost('views.open', {
          trigger_id: payload.trigger_id,
          view: payloads.request_recognition()
        });
        break;
      case 'dismiss':
        await api.callAPIMethodPost('chat.delete', {
          channel: payload.channel.id,
          ts: payload.message.ts
        });
        break;
      case 'approve':
        await api.postRecognition(payload, JSON.parse(action.value));
        break;
      case 'reject':
        await api.rejectRecognition(payload, JSON.parse(action.value));
        break;
    }
  } else if (payload.type === 'view_submission') {
    return handleViewSubmission(payload, res);
  }

  return res.status(404).send();

});

/*
 * Endpoint to receive events from interactive message and a dialog on Slack.
 * Verify the signing secret before continuing.
 */
app.post('/options', async (req, res) => {
  if (!signature.isVerified(req)) return res.status(400).send();
  const payload = JSON.parse(req.body.payload);

  let botUser = await api.callAPIMethodPost('auth.test', {})
  let conversations = await api.getChannels(botUser.user_id)
  let options = conversations.map(c => {
    return {
      text: {
        type: 'plain_text',
        text: c.name
      },
      value: c.id
    }
  })

  options = options.filter(option => {
    return option.text.text.indexOf(payload.value) >= 0
  })

  console.log("OPTIONS: ", options)

  return res.send({
    options: options
  })
})


/**
 * Handle all incoming events from the Events API
 */
const handleEvent = async (event) => {
  switch (event.type) {
    case 'app_home_opened':
      if (event.tab === 'messages') {
        // only send initial message for the first time users opens the messages tab,
        // we can check for that by requesting the message history
        let history = await api.callAPIMethodGet('im.history', {
          channel: event.channel,
          count: 1
        })

        if (!history.messages.length) await api.callAPIMethodPost('chat.postMessage', payloads.welcome_message({
          channel: event.channel
        }));
      } else if (event.tab === 'home') {
        await api.callAPIMethodPost('views.publish', {
          user_id: event.user,
          view: payloads.welcome_home()
        });
      }
      break;
    case 'message':
      // only respond to new messages posted by user, those won't carry a subtype
      if (!event.subtype) {
        await api.callAPIMethodPost('chat.postMessage', payloads.welcome_message({
          channel: event.channel
        }));
      }
      break;
  }
}

/**
 * Handle all Block Kit Modal submissions
 */
const handleViewSubmission = async (payload, res) => {
  switch (payload.view.callback_id) {
    case 'request_recognition':
    console.log("request_recognition payload: \n", payload);
      const values = payload.view.state.values;
      let channels = values.channel.channel_id.selected_options.map(channel => channel.value);
      let channelString = channels.map(channel => `<#${channel}>`).join(', ');

      // respond with a stacked modal to the user to confirm selection
      let recognition = {
        user: values.user.user_id.value,
        message: values.message.message_id.value,
        reward: values.reward.reward_id.selected_reward,
        approver: values.approver.approver_id.value,
        channels: channels,
        channelString: channelString
      }
      return res.send(payloads.confirm_recognition({
        recognition
      }));
    case 'confirm_recognition':
      await api.requestRecognition(payload.user, JSON.parse(payload.view.private_metadata));
      // show a final confirmation modal that the request has been sent
      return res.send(payloads.finish_recognition());
  }
}


const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


// render a default error page for a route that doesn’t exist
// router.get('*', function(req, res) {  res.render('error'); });


module.exports = app;





