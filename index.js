// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

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
  
  // Gets image, write prompt
const imagePrompt =
    "A somber image representing the suffering of people in Gaza amidst war and destruction, with a focus on hope amidst the devastation.";
  const imageURL = await generateAIImage(imagePrompt);
  const imagePath = await downloadImage(imageURL);


  // Write your prompt here
  const prompt =
    "Generate emotionally impactful Twitter post related to the ongoing situation in Gaza. The tweet should report tragic event, capturing the gravity of the situation in a sensitive and respectful tone. The posts should be brief, under 280 characters, and formatted in a way similar to @Timesofgaza, mentions of Israeli actions. Maintain the plain text style without unnecessary vagueness and do not repeat the previous post. If there is no new news just talk about the general tragedy";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  await sendTweetWithImage(tweetText, imagePath);

}

run();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
async function generateAIImage(imagePrompt) {
  try {
    const response = await axios.post(
      "https://api.dalle.ai/generate", // Replace with actual image generation API URL
      { prompt: imagePrompt },
      {
        headers: {
          Authorization: `Bearer ${SECRETS.DALLE_API_KEY}`,
        },
      }
    );
    return response.data.url; // Assuming response contains the URL of the generated image
  } catch (error) {
    console.error("Error generating AI image:", error);
  }
}

// Function to download the image
async function downloadImage(imageUrl) {
  const imagePath = "./generated-image.jpg"; // Path to save the image locally
  const writer = fs.createWriteStream(imagePath);

  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(imagePath));
    writer.on("error", reject);
  });
}


async function sendTweetWithImage(tweetText, imagePath) {
  try {
    // Upload the image to Twitter
    const mediaId = await twitterClient.v1.uploadMedia(imagePath);

    // Post tweet with image
    await twitterClient.v2.tweet({
      text: tweetText,
      media: {
        media_ids: [mediaId],
      },
    });

    console.log("Tweet with image sent successfully!");
  } catch (error) {
    console.error("Error sending tweet with image:", error);
  }
}
