// api url
const baseUrl = 'http://localhost:3000/synth/'
// presets container
const presetsContainer = document.getElementById('presets-container');
// values for sound parameters form and fields
const synthForm = document.getElementById('synth-form');
const envelopeValue = document.getElementById('envelope');
const reverbValue = document.getElementById('reverb');
const delayValue = document.getElementById('delay');

// sound parameter settings button wiring
const envelopeButton = document.getElementById('envelope-button');
const reverbButton = document.getElementById('reverb-button');
const delayButton = document.getElementById('delay-button');

envelopeButton.addEventListener('click', setEnvelope);
delayButton.addEventListener('click', setDelay);
reverbButton.addEventListener('click', setReverb);
synthForm.addEventListener('submit', createSynth);

function setEnvelope(e) {
  envelopeGenerator = envelopeValue.value;
  console.log(envelopeGenerator);
}

function setReverb(e) {
  reverbSetting.decay = reverbValue.value;
  console.log(reverbSetting.decay);
}

function setDelay(e) {
  delaySetting.delayTime.value = delayValue.value;
  console.log(delaySetting.delayTime.value);
}
// save presets to api
function createSynth(e) {
  e.preventDefault();