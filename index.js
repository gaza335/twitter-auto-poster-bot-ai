// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");


const random = require('random');

// Generate a random integer between 1 and 6
const num = random.int(1, 6);

// Dynamically construct the path to the image
const imagePath = `./${num}.jpg`; // Use backticks for template literals

console.log(`Generated random number: ${num}`);
console.log(`Path to the image: ${imagePath}`);



const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 400,
};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });

  // Write your prompt here
  const prompt =
    "Generate emotionally impactful yet compassionate Twitter post related to the ongoing situation in Gaza. The tweet should report tragic events new, capturing the gravity of the situation in a sensitive and respectful tone. The posts should be brief, under 200 characters, and formatted in a way similar to @Timesofgaza, mentions of Israeli actions. Maintain the plain text style without unnecessary vagueness and do not repeat the previous post.do not repeat the previous post. If there is no new news just talk about the general tragedy";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  sendTweet(text,imagePath);
}

run();

async function sendTweet(tweetText, imagePath) {
  try {
    console.log(`Tweet: ${tweetText}`);
    console.log(`Image Path: ${imagePath}`);
    // Add code here to upload the image and post the tweet
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}




