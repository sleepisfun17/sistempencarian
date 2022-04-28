const speech = require("@google-cloud/speech");
const fs = require("fs");

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
}

getTranscript();
