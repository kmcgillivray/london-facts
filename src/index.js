/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask London Scholar for a London fact"
 *  Alexa: "Here's your London fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing London facts.
 */
var LONDON_FACTS = [
    "The Bakerloo Line got its name from combining Baker Street and Waterloo.",
    "It has been estimated that around half a million mice are living across the Underground network.",
    "The original Roman name for London was Londinium.",
    "Big Ben is the name of the bell inside of Elizabeth Tower, not the name of the tower itself.",
    "The Beatles played their last concert on the rooftop of 3 Saville Row.",
    "The Jamaica Wine House is the site of London's first coffee house, founded in sixteen fifty two. Samuel Pepys visited it in sixteen sixty.",
    "More than 1000 bodies are buried underneath Aldgate station, in a plague pit built in sixteen sixty five.",
    "More than half of the London Underground runs above ground.",
    "London black cab drivers must pass an incredibly difficult London geography test including 25,000 streets and 20,000 places of interest within a six mile radius of Charing Cross.",
    "The Fleet River, one of the capital's many buried waterways, still runs under the cellars of the Cheshire Cheese pub on Fleet Street.",
    "The Piccadilly Circus statue known as Eros, is actually intended to depict the Angel of Christian Charity.",
    "London was the first city to reach a population of more than one million, in eighteen eleven. It remained the largest city in the world until it was overtaken by Tokyo in nineteen fifty seven.",
    "Brought back from China by Dutch merchants, tea made its first appearance in London in September 1658, when the new beverage was advertised in a pamphlet by Thomas Garraway, a coffeehouse owner."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * LondonScholar is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var LondonScholar = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
LondonScholar.prototype = Object.create(AlexaSkill.prototype);
LondonScholar.prototype.constructor = LondonScholar;

LondonScholar.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("LondonScholar onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

LondonScholar.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("LondonScholar onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
LondonScholar.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("LondonScholar onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

LondonScholar.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask London Scholar tell me a London fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random London fact from the London facts list
    var factIndex = Math.floor(Math.random() * LONDON_FACTS.length);
    var fact = LONDON_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your London fact: " + fact;

    response.tellWithCard(speechOutput, "LondonScholar", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the LondonScholar skill.
    var londonScholar = new LondonScholar();
    londonScholar.execute(event, context);
};
