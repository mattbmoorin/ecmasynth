 // sound creation
 const voice1 = new Tone.PolySynth(Tone.FMSynth).toDestination();
 const voice2 = new Tone.PolySynth(Tone.AMSynth).toDestination();
 const reverbSetting = new Tone.Reverb().toDestination();
 const delaySetting = new Tone.FeedbackDelay(0, 0.5).toDestination();
 // fx signal routing
 let envelopeGenerator = envelopeValue.value;
 voice1.connect(reverbSetting);
 voice1.connect(delaySetting);
 // create keyboard interface
 const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
 // dynamically update and concat to note html depending on the clicked note value
 let html = '';
 // this loop wrapper is used to set the number of available octaves on the keyboard interface
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
     // Tone.Js syntax requires an octave number next to a note
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

 document.getElementById('synth-container').innerHTML = html;

 // accessing the previously declared data attribute using dataset.note
 // turns keys different colors when pressed and then back to og color on release
 function noteUp(element, isSharp) {
   element.style.background = isSharp ? '#777' : 'white';
 }

 function noteDown(element, isSharp) {
   element.style.background = isSharp ? 'black' : '#ccc';

   const note = element.dataset.note;

   // building envelope generators
   voice1.triggerAttackRelease(note, `${envelopeGenerator}`);
   voice2.triggerAttackRelease(note, `${envelopeGenerator}`);
   // stop keyagation so accidentals dont trigger white keys
   event.stopPropagation();
 }