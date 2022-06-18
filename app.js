const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");
const recorder = require("node-record-lpcm16");

// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");

// fungsi rekaman audio
function getRecord() {
  const file = fs.createWriteStream("tmp/record.wav", { encoding: "binary" });

  const recording = recorder.record();
  recording.stream().pipe(file);

  setTimeout(() => {
    file.end();
  }, 4000);
}

// fungsi transkrip audio to text
async function getTranscript() {
  const client = new speech.SpeechClient();

  const filename = "tmp/record.wav";
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

//use ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Sistem Pencarian",
  });
});

app.get("/record", (req, res) => {
  res.render("record", {
    title: "Rekam Suara",
  });
  getRecord();
});

app.get("/result", (req, res) => {
  async function mainResult() {
    await getTranscript();
    res.render("result", {
      title: "Hasil Pencarian",
      transcription,
    });
  }

  mainResult();
});

app.listen(port, () => {
  console.log(`Sistem Pencarian is listening on port ${port}`);
});
