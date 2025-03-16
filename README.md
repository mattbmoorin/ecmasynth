# **_ECMASYNTH_ user manual**

**A synthesizer with adjustable parameters built with vanilla JavaScript and Tone.JS. An API developed using Ruby on Rails is available to store and recall effects presets.**

## _USING THE KEYBOARD_

- As of now, the keyboard can only be interacted with by clicking the desired key with your mouse. More control options coming soon.

## _EFFECTS_

- The effects are editable via the form in the top left corner of the page. Enter the desired value and press the **_Set_** button to inact the changes. A much more robust effects section is currently in development.

| EFFECT        | DESCRIPTION   |
| ------------- | ------------- |
| **_Release_** | This setting adjusts the time of the Release of the Attack/Release Envelope. The higher the number, the longer the note will sound. |
| **_Reverb Decay_** | This setting adjusts how long the reverb "trail" lasts. The higher the number, the longer the "trail". Use higher values to emulate a larger space such as a hall or cave and shorter values to invoke a more "room" type sound. |
| **_Delay Time_** | This setting adjusts how long the delay repeats are apart from each other as well as how much the effect is present in the audio signal. You could envision this setting as a knob where 0 is completely counter-clockwise and 1 is all the way up. The higher the number, the farther apart the delay repeats will be. Experiment with any decimal number in between 0 and 1 for a variety of settings. |

## _PRESETS_

**_SAVE PRESET_** - Saves the current effects form values to a preset slot. There is virtually no limit to the amount of available Preset slots. Saved Presets will appear in the top right corner of the page.

**_LOAD PRESET_** - Populates the Effects form values with the corresponding Preset values. Note that one must still press the **_Set_** buttons in order to inact the parameters with the populated values.

**_DELETE PRESET_** - Remove the corresoponding Preset from the database.

## _MIDNIGHT MODE_

If you don't use dark mode are you really even using a computer?