const baseUrl = 'http://localhost:3000/synth/';

envelopeButton.addEventListener('click', setEnvelope);
delayButton.addEventListener('click', setDelay);
reverbButton.addEventListener('click', setReverb);
synthForm.addEventListener('submit', createSynth);

function darkMode() {
  document.body.classList.toggle('dark-mode');
}

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

function createSynth(e) {
  e.preventDefault();

  let synth = {
    envelope: envelope.value,
    reverb: reverb.value,
    delay: delay.value,
  };
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(synth),
  })
    .then((res) => res.json())
    .then((res) => getSingleSynth(res));
}

function getSingleSynth(res) {
  return fetch(baseUrl + res.id)
    .then((res) => res.json())
    .then((res) => appendProcess(res))
    .then((res) => appendSinglePreset(res))
    .catch((error) => console.log(error));
}

function getSynths() {
  return fetch(baseUrl)
    .then((res) => res.json())
    .then((res) => appendPresets(res))
    .catch((error) => console.log(error));
}

function appendPresets(res) {
  console.log(res);

  let presetElements = res.map((preset) => appendProcess(preset));
  presetElements.forEach((preset) => presetsContainer.append(preset));
}

function appendSinglePreset(res) {
  console.log(res);

  presetsContainer.append(res);
}

function appendProcess(preset) {
  let loadButton = document.createElement('button');
  let deleteButton = document.createElement('button');
  let ul = document.createElement('ul');

  loadButton.innerHTML = 'Load Preset';
  deleteButton.innerHTML = 'Delete Preset';

  loadButton.className = 'button is-info';
  deleteButton.className = 'button is-danger is-outlined';

  ul.innerHTML = `User Preset ${preset.id}<br />`;
  ul.id = preset['id'];

  ul.appendChild(loadButton);
  ul.appendChild(deleteButton);

  loadButton.addEventListener('click', (e) => {
    envelope.value = preset.envelope;
    reverb.value = preset.reverb;
    delay.value = preset.delay;
  });

  deleteButton.addEventListener('click', (e) => {
    e.target.parentNode.remove();
    return fetch(baseUrl + preset.id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  });
  return ul;
}

getSynths();
