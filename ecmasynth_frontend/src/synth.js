class Synth {
  static noteUp(element, isSharp) {
    element.style.background = isSharp ? '#777' : 'white';
  }

  static noteDown(element, isSharp) {
    element.style.background = isSharp ? 'black' : '#ccc';

    const note = element.dataset.note;

    voice1.triggerAttackRelease(note, `${envelopeGenerator}`);
    voice2.triggerAttackRelease(note, `${envelopeGenerator}`);
    event.stopPropagation();
  };

  static drawSynthOnPage() {
    let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let html = '';

    for (let octave = 0; octave < 2; octave++) {
      notes.forEach((note, i) => {
        let whiteNote = notes[i];
        let hasSharp = true;

        if (whiteNote == 'E' || whiteNote == 'B') hasSharp = false;
        html += `<div class='whitenote'
        onmousedown='Synth.noteDown(this, false)'
        onmouseup='Synth.noteUp(this, false)'
        onmouseleave='Synth.noteUp(this, false)'
        data-note='${note + (octave + 4)}'>`;
        if (hasSharp) {
          html += `<div class='blacknote'
        onmousedown='Synth.noteDown(this, true)'
        onmouseup='Synth.noteUp(this, true)'
        onmouseleave='Synth.noteUp(this, true)'
        data-note='${note + '#' + (octave + 4)}'></div>`;
        }

        html += '</div>';
        document.getElementById('synth-container').innerHTML = html;
      });
    };
  };
};

Synth.drawSynthOnPage();

const voice1 = new Tone.PolySynth(Tone.FMSynth).toDestination();
const voice2 = new Tone.PolySynth(Tone.AMSynth).toDestination();
const reverbSetting = new Tone.Reverb().toDestination();
const delaySetting = new Tone.FeedbackDelay(0, 0.5).toDestination();
let envelopeGenerator = envelopeValue.value;
voice1.connect(reverbSetting);
voice1.connect(delaySetting);