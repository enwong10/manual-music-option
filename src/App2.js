import React, { Component } from 'react';
import abcjs from 'abcjs';
import './App.css';

class App2 extends Component {
  constructor() {
    super();
    //ABCvalue[X, Title, Key, Meter, Tempo, Rhythm, UNL, Body]
    this.state = {
      ABCvalue: {
        'X': "1",
        'T': "Cooley's",
        'K': "Em",
        'M': "4/4",
        'Q': "60",
        'R': "reel",
        'L': "1/8",
        '': "|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD| \n" +
          "EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:| \n" +
          "|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg| \n" +
          "eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:| \n"
      },
      staff: null,
      midi: new abcjs.synth.CreateSynth()
    };
    this.updateStaff = this.updateStaff.bind(this);
    this.createABCString = this.createABCString.bind(this);
    this.startAudio = this.startAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.updateProp = this.updateProp.bind(this);
    this.closeAdvanced = this.closeAdvanced.bind(this);
  }

  componentDidMount() {
    this.setState({ staff: abcjs.renderAbc("staff", this.createABCString()) });
  }

  updateStaff(event) {
    const newVal = { ...this.state.ABCvalue, '': event.target.value };
    this.setState({ ABCvalue: newVal }, () => {
      this.setState({ staff: abcjs.renderAbc("staff", this.createABCString()) });
    });
  }

  createABCString() {
    var abcString = ''
    for (const [key, value] of Object.entries(this.state.ABCvalue)) {
      if (key !== '') {
        abcString += key + ': ' + value + " \n";
      }
      else {
        abcString += value;
      }
    }
    return abcString;
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

  toggleAdvanced() {
    this.setState({ openAdvanced: !this.state.openAdvanced });
  }


  closeAdvanced() {
    this.setState({ staff: abcjs.renderAbc("staff", this.createABCString()) })
    this.toggleAdvanced();
  }

  updateProp(event) {
    const newVal = { ...this.state.ABCvalue, [event.target.id]: event.target.value };
    this.setState({ ABCvalue: newVal })
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
            <textarea style={{ height: "100px", width: "1150px", alignSelf: "center" }} value={this.state.ABCvalue['']} onChange={this.updateStaff}></textarea>
            <div>
              <button onClick={this.startAudio} style={{ marginRight: "20px", marginTop: "10px" }}>Play</button>
              <button onClick={this.stopAudio}>Stop</button>
              <div className='audio-error' style={{ display: "none" }}>Audio is not supported in this browser.</div>
            </div>
            <div style={{ margin: "20px", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <button className="open-button" onClick={this.toggleAdvanced}>Advanced Options</button>

              <div className={!this.state.openAdvanced ? 'hidden' : 'form-popup'}>
                <form action="/action_page.php" className="form-container">
                  <h3 style={{ color: "black", marginBottom: "10px" }}>Advanced Options</h3>
                  <div style={{ flex: "1" }}>
                    <table style={{ width: "100%", padding: "0px 15px", textAlign: "left" }}>
                      <colgroup>
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "65%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Title: </b></label></td>
                          <td><input type="text" id="T" placeholder="Enter Title" defaultValue={this.state.ABCvalue['T']} onChange={this.updateProp} required></input></td>
                        </tr>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Key: </b></label></td>
                          <td><input type="text" id="K" placeholder="Enter Key (append 'm' for minor)" defaultValue={this.state.ABCvalue['K']} onChange={this.updateProp} required></input></td>
                        </tr>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Meter: </b></label></td>
                          <td><input type="text" id="M" placeholder="Enter Meter (ex. 4/4)" defaultValue={this.state.ABCvalue['M']} onChange={this.updateProp} required></input></td>
                        </tr>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Tempo: </b></label></td>
                          <td><input type="text" id="Q" placeholder="Enter Tempo" defaultValue={this.state.ABCvalue['Q']} onChange={this.updateProp} required></input></td>
                        </tr>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Rhythm: </b></label></td>
                          <td><input type="text" id="R" placeholder="Enter Rhythm" defaultValue={this.state.ABCvalue['R']} onChange={this.updateProp} required></input></td>
                        </tr>
                        <tr>
                          <td><label style={{ fontSize: "large" }}><b>Unit Note Length: </b></label></td>
                          <td><input type="text" id="L" placeholder="Enter Password" defaultValue={this.state.ABCvalue['L']} onChange={this.updateProp} required></input></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <button type="button" onClick={this.closeAdvanced}>Close</button>
                  </div>
                </form>
              </div>
              <button style={{ backgroundColor: "green", marginRight: "20px", marginLeft: "20px" }}>Save</button>
              <button style={{ backgroundColor: "red" }}>Cancel</button>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App2;
