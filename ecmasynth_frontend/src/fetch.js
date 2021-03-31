let synth = {
  envelope: envelope.value,
  reverb: reverb.value,
  delay: delay.value
};
return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(synth)
  })
  .then(res => res.json())
  .then(res => getSynth(res));
};


// get newly created preset without reload
function getSynth(res) {
  return fetch(baseUrl + res.id).then(res => res.json())
    .then(res => appendProcess(res))
    .then(res => appendSinglePreset(res))
    .catch(error => console.log(error));
};
// get presets from api
function getSynths() {
  return fetch(baseUrl).then(res => res.json())
    .then(res => appendPresets(res))
    .catch(error => console.log(error));
};
// load preset button selectors
const envelopeField = document.getElementById('envelope');
const reverbField = document.getElementById('reverb');
const delayField = document.getElementById('delay');
// append presets to DOM
function appendProcess(preset) {
  let setButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  setButton.innerHTML = 'Load Preset';
  deleteButton.innerHTML = 'Delete Preset';

  let ul = document.createElement('ul');

  ul.innerHTML = `User Preset ${preset.id}<br />`;
  ul.id = preset['id'];

  ul.appendChild(setButton);
  ul.appendChild(deleteButton);

  setButton.addEventListener('click', (e) => {
    envelope.value = preset.envelope;
    reverb.value = preset.reverb;
    delay.value = preset.delay;
  });

  deleteButton.addEventListener('click', (e) => {
    e.target.parentNode.remove();
    return fetch(baseUrl + preset.id, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(res => console.log(res));
  });
  return ul;
};

function appendPresets(res) {
  console.log(res);

  let presetElements = (res).map(preset => appendProcess(preset));
  presetElements.forEach(preset => presetsContainer.append(preset));
};

function appendSinglePreset(res) {
  console.log(res);

  presetsContainer.append(res);
}

getSynths();