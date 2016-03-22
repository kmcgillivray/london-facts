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
var APP_ID = amzn1.echo-sdk-ams.app.fb8d0563-bb33-4f69-8b06-bbe5e0017bc4; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

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
    "Brought back from China by Dutch merchants, tea made its first appearance in London in September sixteen fifty eight, when the new beverage was advertised in a pamphlet by Thomas Garraway, a coffeehouse owner.",
    "80,000 umbrellas are lost every year on the tube.",
    "Mosquitoes live within tube tunnels.  They’re not native to Britain and can’t be found anywhere else. It’s thought they travelled on Underground trains from Heathrow where they arrived by plane. They also form their own unique species.",
    "London Bridge is 883 feet long.",
    "The original London Bridge was built in eleven seventy six and took thirty three years to build. It featured a large number of shops, houses, and other buildings. The houses were up to seven stories high.",
    "Tower Bridge is 801 feet long.",
    "Before Tower Bridge, was built, Londoners crossed the river in the same location through the Tower Subway, a 410 meter tunnel. It was closed to pedestrians in eighteen ninety eight.",
    "London Zoo is the world’s oldest zoo, having opened in eighteen twenty eight.",
    "London Stone is a historic landmark at 111 Cannon Street. The name 'London Stone' was first recorded around the year eleven hundred. The date and original purpose of the Stone are unknown.",
    "The British Museum collection totals at least 8 million objects.",
    "There are over 300 museums in London.",
    "The British Library was formed in nineteen seventy three from the British Museum Library. It has over 14 million books, 920,000 journal titles and 3 million sound recordings.",
    "When it was established in eighteen fifty seven the Victoria and Albert Museum was called the South Kensington Museum.",
    "The River Thames is 215 miles long, has 47 locks and carries some 300,000 tonnes of sediment a year.",
    "The word 'Strand' is an old English word for 'shore'. It makes reference to when the Thames was more shallow and more wide, and would have flowed along the side of the Strand.",
    "The Port of London still handles 45 million tons of cargo through the Thames every year.",
    "One of the oldest pubs in London, Ye Olde Cheshire Cheese, was built shortly after the Great Fire of London in sixteen sixty six. Mark Twain, Charles Dickens, Sir Arthur Conan Doyle, and G. K. Chesterton are all said to have been regulars.",
    "8 people drowned and 15 buildings were completely destroyed in the Great London Beer Flood of eighteen fourteen.  A brewery vat burst just behind what is now New Oxford Street and 30,000 galloons of beer flooded the area.",
    "London’s first sandwich bar, Sandy’s, opened in Oxenden Street in nineteen thirty three.",
    "In nineteen fifty two, Tower Bridge began to open while a double decker bus was still on it. The driver drove the bus to jump a three foot gap across the bridge to safety.",
    "The only road in London in which you can drive on the right is Savoy Court, the short, turning street in front of the Savoy Hotel.",
    "London is home to people speaking 300 different languages.",
    "London is the only city that has hosted the Olympics three times.",
    "Hatchards of Piccadilly is the oldest bookshop in London and opened its doors in seventeen ninety seven.",
    "40% of Londoners died in the Black Death of thirteen forty eight.",
    "The square mile of The City is actually 1.12 square miles. It has 11,000 residents, but 330,000 people travel to work in this one square mile daily."
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
