import React, { Component } from 'react';
import abcjs from 'abcjs';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ABCvalue: "X: 1 \n" +
        "T: Cooley's \n" +
        "M: 4/4 \n" +
        "L: 1/8 \n" +
        "R: reel \n" +
        "K: Emin \n" +
        "|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD| \n" +
        "EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:| \n" +
        "|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg| \n" +
        "eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:| \n",
      staff: null,
      midi: new abcjs.synth.CreateSynth()
    };
    this.updateStaff = this.updateStaff.bind(this);
    this.startAudio = this.startAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
  }

  updateStaff(event) {
    this.setState({ ABCvalue: event.target.value }, () =>
      this.setState({staff: abcjs.renderAbc("staff", this.state.ABCvalue)}));
  }

  startAudio() {
    if (abcjs.synth.supportsAudio()) {
      var visualObj = this.state.staff[0];
      var midiBuffer = this.state.midi;
      window.AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        navigator.mozAudioContext ||
        navigator.msAudioContext;
      var audioContext = new window.AudioContext();
      audioContext.resume().then(function () {

        return midiBuffer.init({
          visualObj: visualObj,
          audioContext: audioContext,
          millisecondsPerMeasure: visualObj.millisecondsPerMeasure()
        }).then(function (response) {
          // console.log(response); // this contains the list of notes that were loaded.
          // midiBuffer.prime actually builds the output buffer.
          return midiBuffer.prime();
        }).then(function () {
          // At this point, everything slow has happened. midiBuffer.start will return very quickly and will start playing very quickly without lag.
          midiBuffer.start();
          return Promise.resolve();
        }).catch(function (error) {
          if (error.status === "NotSupported") {
            var audioError = document.querySelector(".audio-error");
            audioError.setAttribute("style", "");
          } else
            console.warn("synth error", error);
        });
      });
    } else {
      var audioError = document.querySelector(".audio-error");
      audioError.setAttribute("style", "");
    }
  }

  stopAudio() {
    this.state.midi.stop();
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <div className="popup">
            <h2 style={{ color: "black", textAlign: "left", marginLeft: "1em" }}>Manual:</h2>
            <div style={{ flex: "1", overflowY: "auto", width: "1150px", alignSelf: "center" }}>
              <div id="staff" ></div>
            </div>
            <textarea style={{ height: "100px", width: "1150px", alignSelf: "center" }} value={this.state.ABCvalue} onChange={this.updateStaff}></textarea>
            <div>
              <button onClick={this.startAudio} style={{ marginRight: "20px", marginTop: "10px" }}>Play</button>
              <button onClick={this.stopAudio}>Stop</button>
              <div className='audio-error' style={{ display: "none" }}>Audio is not supported in this browser.</div>
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

  componentDidMount() {
    this.setState({staff: abcjs.renderAbc("staff", this.state.ABCvalue)});
  }
}

export default App;
