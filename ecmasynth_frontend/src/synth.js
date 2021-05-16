const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

let html = '';

const voice1 = new Tone.PolySynth(Tone.FMSynth).toDestination();
const voice2 = new Tone.PolySynth(Tone.AMSynth).toDestination();
const reverbSetting = new Tone.Reverb().toDestination();
const delaySetting = new Tone.FeedbackDelay(0, 0.5).toDestination();
let envelopeGenerator = envelopeValue.value;
voice1.connect(reverbSetting);
voice1.connect(delaySetting);

function noteUp(element, isSharp) {
  element.style.background = isSharp ? '#777' : 'white';
}

function noteDown(element, isSharp) {
  element.style.background = isSharp ? 'black' : '#ccc';

  const note = element.dataset.note;

  voice1.triggerAttackRelease(note, `${envelopeGenerator}`);
  voice2.triggerAttackRelease(note, `${envelopeGenerator}`);
  event.stopPropagation();
}

function drawSynthOnPage() {
  for (let octave = 0; octave < 2; octave++) {
    notes.forEach((note, i) => {
      let whiteNote = notes[i];
      let hasSharp = true;

      if (whiteNote == 'E' || whiteNote == 'B') hasSharp = false;
      html += `<div class='whitenote'
        onmousedown='noteDown(this, false)'
        onmouseup='noteUp(this, false)'
        onmouseleave='noteUp(this, false)'
        data-note='${note + (octave + 4)}'>`;
      if (hasSharp) {
        html += `<div class='blacknote'
        onmousedown='noteDown(this, true)'
        onmouseup='noteUp(this, true)'
        onmouseleave='noteUp(this, true)'
        data-note='${note + '#' + (octave + 4)}'></div>`;
      }

      html += '</div>';
    });
  }
}

drawSynthOnPage();
document.getElementById('synth-container').innerHTML = html;
