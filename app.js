const express = require("express");
const app = express();
const port = 3000;

//fungsi transkrip audio to text
async function getTranscript() {
  // Imports the Google Cloud client library
  const fs = require("fs");
  const speech = require("@google-cloud/speech");

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const filename = "rumahtangga.wav";
  const encoding = "LINEAR16";
  const sampleRateHertz = 16000;
  const languageCode = "id-ID";

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(filename).toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results.map((result) => result.alternatives[0].transcript).join("\n");
  console.log("Transcription: ", transcription);
  this.transcription = transcription;
}

getTranscript();

//use ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Sopipi Tuhandred Aikyu",
    transcription,
  });
});

// app.post("/", (req, res) => {
//   // const search = document.getElementById("search").value;
//   console.log(req.body.search);
// });

app.get("/result", (req, res) => {
  res.render("result", { title: "Hasil Pencarian" });
});

app.listen(port, () => {
  console.log(`Sistem Pencarian is listening on port ${port}`);
});
