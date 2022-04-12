const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const recorder = require("node-record-lpcm16");
const AudioRecorder = require("node-audiorecorder");
// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
// import fetch from "node-fetch";
// fungsi api key
// Imports the Google Cloud client library.
// const { Storage } = require("@google-cloud/storage");

// // Instantiates a client. Explicitly use service account credentials by
// // specifying the private key file. All clients in google-cloud-node have this
// // helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// const projectId = "sistem-pencarian-345108";
// const keyFilename = "C:/Users/MIrfanFanani/Documents/gapikey/sistem-pencarian-345108-9b49db4a2de5.json";
// const storage = new Storage({ projectId, keyFilename });

// // Makes an authenticated API request.
// async function listBuckets() {
//   try {
//     const [buckets] = await storage.getBuckets();

//     console.log("Buckets:");
//     buckets.forEach((bucket) => {
//       console.log(bucket.name);
//     });
//   } catch (err) {
//     console.error("ERROR:", err);
//   }
// }
// listBuckets();

// fungsi rekaman audio
function getRecord() {
  const file = fs.createWriteStream("record.wav", { encoding: "binary" });

  const recording = recorder.record();
  recording.stream().pipe(file);

  setTimeout(() => {
    file.end();
  }, 4000);
}

// fungsi transkrip audio to text
async function getTranscript() {
  const client = new speech.SpeechClient();

  const filename = "record.wav";
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
    title: "Sopipi Tuhandred Aikyu",
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
