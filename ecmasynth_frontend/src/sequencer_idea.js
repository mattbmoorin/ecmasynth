// start sequencer

/* <div>
		<tone-play-toggle></tone-play-toggle>
		<tone-slider label="tempo" units="bpm" min="60" max="240" value="120"></tone-slider>
		<tone-step-sequencer></tone-step-sequencer>
	  </div>
    </tone-example> */


const keys = new Tone.Players({
  urls: {
    0: 'A1.mp3',
    1: 'Cs2.mp3',
    2: 'E2.mp3',
    3: 'Fs2.mp3',
  },
  fadeOut: '64n',
  baseUrl: 'https://tonejs.github.io/audio/casio/',
}).toDestination();

document
  .querySelector('tone-play-toggle')
  .addEventListener('start', () => Tone.Transport.start());
document
  .querySelector('tone-play-toggle')
  .addEventListener('stop', () => Tone.Transport.stop());
document
  .querySelector('tone-slider')
  .addEventListener(
    'input',
    (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
  );
document
  .querySelector('tone-step-sequencer')
  .addEventListener('trigger', ({
    detail
  }) => {
    keys.player(detail.row).start(detail.time, 0, '16t');
  });