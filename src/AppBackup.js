import React, { Component } from 'react';
import SVGMusicNotation from 'svg-music-notation';
import MidiWriter from 'midi-writer-js';
import MidiPlayer from 'midi-player-js';
import './App.css';
import WholeNote from './images/WholeNote.png';
import DHalfNote from './images/DHalfNote.png';
import HalfNote from './images/HalfNote.png';
import DQuarterNote from './images/DQuarterNote.png';
import QuarterNote from './images/QuarterNote.png';
import DEighthNote from './images/DEighthNote.png';
import EighthNote from './images/EighthNote.png';
import SixteenthNote from './images/SixteenthNote.png';
import WholeRest from './images/WholeRest.png';
import HalfRest from './images/HalfRest.png';
import QuarterRest from './images/QuarterRest.png';
import EighthRest from './images/EighthRest.png';
import SixteenthRest from './images/SixteenthRest.png';

class App extends Component {

  play(x) {
    console.log(x);
    var Player = new MidiPlayer.Player(function (event) {
      console.log(event);
    });

    // Load a MIDI file
    // NEEDS TO BE A PATH
    // Player.loadFile(x);
    // Player.play();
  }

  render() {
    const userSource = `
    TrebleClef 4/4 C5-4n D5-4n E5-4n D5-4n | C5-4n D5-4n F5-4n E5-4n | C5-4n D5-4n E5-4n D5-4n C5-4n |
    | | | 
    R-4n A4-8n G4-8n A4-8n G4-8n A4-8n G4-8n | C5-4n D5-4n E5-4n D5-8n C5-8n | C5-4n D5-4n F5-4n E5-4n |B
    | | |
    `;
    var track = new MidiWriter.Track();

    // Define an instrument (optional):
    //track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

    //THIS WILL BE DYNAMIC 
    // var note = new MidiWriter.NoteEvent({ pitch: ['C5'], duration: '4' });
    // track.addEvent(note);

    // console.log(this.midiSounds);
    track.addEvent([
      new MidiWriter.NoteEvent({ pitch: ['E4', 'D4'], duration: '4' }),
      new MidiWriter.NoteEvent({ pitch: 'C4', duration: '2' }),
      new MidiWriter.NoteEvent({ pitch: ['E4', 'D4'], duration: '4' }),
      new MidiWriter.NoteEvent({ pitch: 'C4', duration: '2' }),
      new MidiWriter.NoteEvent({ pitch: ['C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4'], duration: '8' }),
      new MidiWriter.NoteEvent({ pitch: ['E4', 'D4'], duration: '4' }),
      new MidiWriter.NoteEvent({ pitch: 'C4', duration: '2' })
    ], function (event, index) {
      return { sequential: true };
    }
    );

    // Generate a data URI
    var write = new MidiWriter.Writer(track);
    console.log(write.dataUri());

    return (
      <div className="App">
        <header className="App-header">
          <script type='text/javascript' src='//www.midijs.net/lib/midi.js'></script>
          <div className="popup">
            <h2 style={{ color: "black", textAlign: "left", marginLeft: "1em" }}>Manual:</h2>
            <div id="staff" style={{ flex: "1" }}>
              <SVGMusicNotation height={'100%'} width={'90%'} source={userSource} />
            </div>
            <div>
              <p><button onClick={this.play(track)}>Play</button></p>
            </div>
            <div>
              <button><img src={WholeNote} height={'50px'} width={'50px'} alt="WholeNote" /></button>
              <button><img src={DHalfNote} height={'50px'} width={'50px'} alt="DHalfNote"/></button>
              <button><img src={HalfNote} height={'50px'} width={'50px'} alt="HalfNote"/></button>
              <button><img src={DQuarterNote} height={'50px'} width={'50px'} alt="DQuarterNote"/></button>
              <button><img src={QuarterNote} height={'50px'} width={'50px'} alt="QuarterNote"/></button>
              <button><img src={DEighthNote} height={'50px'} width={'50px'} alt="DEighthNote"/></button>
              <button><img src={EighthNote} height={'50px'} width={'50px'} alt="EighthNote"/></button>
              <button><img src={SixteenthNote} height={'50px'} width={'50px'} alt="SixteenthNote"/></button>
            </div>
            <div>
              <button><img src={WholeRest} height={'50px'} width={'50px'} alt="WholeRest"/></button>
              <button><img src={HalfRest} height={'50px'} width={'50px'} alt="HalfRest"/></button>
              <button><img src={QuarterRest} height={'50px'} width={'50px'} alt="QuarterRest"/></button>
              <button><img src={EighthRest} height={'50px'} width={'50px'} alt="EighthRest"/></button>
              <button><img src={SixteenthRest} height={'50px'} width={'50px'} alt="SixteenthRest"/></button>
            </div>
            <div style={{ margin: "20px", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <button style={{ backgroundColor: "green", marginRight: "20px" }}>Save</button>
              <button style={{ backgroundColor: "red" }}>Cancel</button>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
