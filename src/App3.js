import React, { Component } from 'react';
import abcjs from 'abcjs';
import './App.css';
import WholeNote from './images/WholeNote.png';
import DHalfNote from './images/DHalfNote.png';
import HalfNote from './images/HalfNote.png';
import DQuarterNote from './images/DQuarterNote.png';
import QuarterNote from './images/QuarterNote.png';
import DEighthNote from './images/DEighthNote.png';
import EighthNote from './images/EighthNote.png';
import SixteenthNote from './images/SixteenthNote.png';
// import WholeRest from './images/WholeRest.png';
// import HalfRest from './images/HalfRest.png';
// import QuarterRest from './images/QuarterRest.png';
// import EighthRest from './images/EighthRest.png';
// import SixteenthRest from './images/SixteenthRest.png';
import Sharp from './images/Sharp.png';
import Natural from './images/Natural.png';
import Flat from './images/Flat.png';
import BarLine from './images/BarLine.png';
import DBarLine from './images/DBarLine.png';
import C3 from './images/C3.png';
import D3 from './images/D3.png';
import E3 from './images/E3.png';
import F3 from './images/F3.png';
import G3 from './images/G3.png';
import A4 from './images/A4.png';
import B4 from './images/B4.png';
import C4 from './images/C4.png';
import D4 from './images/D4.png';
import E4 from './images/E4.png';
import F4 from './images/F4.png';
import G4 from './images/G4.png';
import A5 from './images/A5.png';
import B5 from './images/B5.png';
import C5 from './images/C5.png';
import white from './images/white.png';


class App3 extends Component {
  constructor() {
    super();
    //ABCvalue[X, Title, Key, Meter, Tempo, Rhythm, UNL, Body]
    this.state = {
      ABCvalue: {
        'X': "1",
        'T': "Untitled",
        'K': "C",
        'M': "4/4",
        'Q': "60",
        'R': "",
        'L': "1/4",
        '': "||"
      },
      staff: null,
      midi: new abcjs.synth.CreateSynth(),
      selectedPitch: null
    };
    this.registerPitch = this.registerPitch.bind(this);
    this.registerAccidental = this.registerAccidental.bind(this);
    this.registerLength = this.registerLength.bind(this);
    this.registerOther = this.registerOther.bind(this);
    this.addABCVal = this.addABCVal.bind(this);
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

  registerPitch(event) {
    console.log(event.target.id);
    this.setState({ selectedPitch: event.target.id });
  }

  registerAccidental(event) {
    console.log(event.target.id);
    if (this.state.selectedPitch !== null) {
      this.setState({ selectedPitch: event.target.id + this.state.selectedPitch });
    }
    else {
      console.log('Please select pitch');
    }
  }

  registerLength(event) {
    console.log(event.target.id);
    if (this.state.selectedPitch !== null) {
      this.addABCVal(this.state.selectedPitch + event.target.id);
      this.setState({ selectedPitch: null });
    }
    else {
      console.log('Please select pitch');
    }
  }

  registerOther(event) {
    console.log(event.target.id);
    this.addABCVal(event.target.id);
  }

  addABCVal(val) {
    const newVal = { ...this.state.ABCvalue, '': this.state.ABCvalue[''] + ' ' + val };
    this.setState({ ABCvalue: newVal }, () => {
      this.setState({ staff: abcjs.renderAbc("staff", this.createABCString()) });
    });
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
            <h2 style={{ color: "black", textAlign: "left", marginLeft: "1em", marginBottom: "0" }}>Manual:</h2>
            <div style={{ flex: "1", overflowY: "auto", width: "inherit", alignSelf: "center" }}>
              <div id="staff" ></div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "225px", overflow: "auto", margin: "0px 5px" }}>
              <div style={{ textAlign: "left" }}>
                <label>1. Pitch or Rest</label>
                <div className="group-div">
                  <img id="C" className="select-button-pitch" onClick={this.registerPitch} src={C3} height={'40px'} width={'40px'} alt="C" />
                  <img id="D" className="select-button-pitch" onClick={this.registerPitch} src={D3} height={'40px'} width={'40px'} alt="D" />
                  <img id="E" className="select-button-pitch" onClick={this.registerPitch} src={E3} height={'40px'} width={'40px'} alt="E" />
                  <img id="F" className="select-button-pitch" onClick={this.registerPitch} src={F3} height={'40px'} width={'40px'} alt="F" />
                  <img id="G" className="select-button-pitch" onClick={this.registerPitch} src={G3} height={'40px'} width={'40px'} alt="G" />
                  <img id="A" className="select-button-pitch" onClick={this.registerPitch} src={A4} height={'40px'} width={'40px'} alt="A" />
                  <img id="B" className="select-button-pitch" onClick={this.registerPitch} src={B4} height={'40px'} width={'40px'} alt="B" />
                  <img id="c" className="select-button-pitch" onClick={this.registerPitch} src={C4} height={'40px'} width={'40px'} alt="C" />
                  <img id="d" className="select-button-pitch" onClick={this.registerPitch} src={D4} height={'40px'} width={'40px'} alt="D" />
                  <img id="e" className="select-button-pitch" onClick={this.registerPitch} src={E4} height={'40px'} width={'40px'} alt="E" />
                  <img id="f" className="select-button-pitch" onClick={this.registerPitch} src={F4} height={'40px'} width={'40px'} alt="F" />
                  <img id="g" className="select-button-pitch" onClick={this.registerPitch} src={G4} height={'40px'} width={'40px'} alt="G" />
                  <img id="a" className="select-button-pitch" onClick={this.registerPitch} src={A5} height={'40px'} width={'40px'} alt="A" />
                  <img id="b" className="select-button-pitch" onClick={this.registerPitch} src={B5} height={'40px'} width={'40px'} alt="B" />
                  <img id="c'" className="select-button-pitch" onClick={this.registerPitch} src={C5} height={'40px'} width={'40px'} alt="C" />
                  <img id="z" className="select-button-pitch" onClick={this.registerPitch} src={white} height={'40px'} width={'40px'} alt="" />
                </div>
                {/* <div>
                  <img id="z4" className="select-button" onClick={this.registerOther} src={WholeRest} height={'25px'} width={'25px'} alt="WholeRest" />
                  <img id="z2" className="select-button" onClick={this.registerOther} src={HalfRest} height={'25px'} width={'25px'} alt="HalfRest" />
                  <img id="z1" className="select-button" onClick={this.registerOther} src={QuarterRest} height={'25px'} width={'25px'} alt="QuarterRest" />
                  <img id="z1/2" className="select-button" onClick={this.registerOther} src={EighthRest} height={'25px'} width={'25px'} alt="EighthRest" />
                  <img id="z1/4" className="select-button" onClick={this.registerOther} src={SixteenthRest} height={'25px'} width={'25px'} alt="SixteenthRest" />
                </div> */}
              </div>
              <div style={{ textAlign: "left" }}>
                <label>2. Accidentals</label>
                <div className="group-div-optional">
                  <img id="^" className="select-button" onClick={this.registerAccidental} src={Sharp} height={'25px'} width={'25px'} alt="Sharp" />
                  <img id="=" className="select-button" onClick={this.registerAccidental} src={Natural} height={'25px'} width={'25px'} alt="Natural" />
                  <img id="_" className="select-button" onClick={this.registerAccidental} src={Flat} height={'25px'} width={'25px'} alt="Flat" />
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <label>3. Note Length</label>
                <div className="group-div">
                  <img id="4" className="select-button" onClick={this.registerLength} src={WholeNote} height={'25px'} width={'25px'} alt="WholeNote" />
                  <img id="3" className="select-button" onClick={this.registerLength} src={DHalfNote} height={'25px'} width={'25px'} alt="DHalfNote" />
                  <img id="2" className="select-button" onClick={this.registerLength} src={HalfNote} height={'25px'} width={'25px'} alt="HalfNote" />
                  <img id="3/2" className="select-button" onClick={this.registerLength} src={DQuarterNote} height={'25px'} width={'25px'} alt="DQuarterNote" />
                  <img id="1" className="select-button" onClick={this.registerLength} src={QuarterNote} height={'25px'} width={'25px'} alt="QuarterNote" />
                  <img id="3/4" className="select-button" onClick={this.registerLength} src={DEighthNote} height={'25px'} width={'25px'} alt="DEighthNote" />
                  <img id="1/2" className="select-button" onClick={this.registerLength} src={EighthNote} height={'25px'} width={'25px'} alt="EighthNote" />
                  <img id="1/4" className="select-button" onClick={this.registerLength} src={SixteenthNote} height={'25px'} width={'25px'} alt="SixteenthNote" />
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <label>4. Other</label>
                <div className="group-div-optional">
                  <img id="|" className="select-button" onClick={this.registerOther} src={BarLine} height={'25px'} width={'25px'} alt="BarLine" />
                  <img id="|]" className="select-button" onClick={this.registerOther} src={DBarLine} height={'25px'} width={'25px'} alt="DBarLine" />
                  <button id="&#10;" className="select-button" style={{ height: "50px", width: "115px", backgroundColor: "white" }} onClick={this.registerOther}>New Line</button>
                </div>
              </div>

            </div>
            <div style={{ margin: "10px", marginBottom: "0", display: "flex", flexDirection: "column" }}>
              <label style={{ marginLeft: "0"}}>ABC Notation:</label>
              <textarea style={{ minHeight: "75px" }} value={this.state.ABCvalue['']} onChange={this.updateStaff}></textarea>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
              <div>
                <button onClick={this.startAudio} style={{ marginRight: "10px" }}>Play</button>
                <button onClick={this.stopAudio}>Stop</button>
                <div className='audio-error' style={{ display: "none" }}>Audio is not supported in this browser.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
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
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button type="button" onClick={this.closeAdvanced}>Close</button>
                    </div>
                  </form>
                </div>
                <button style={{ backgroundColor: "green", marginRight: "10px", marginLeft: "10px" }}>Save</button>
                <button style={{ backgroundColor: "red" }}>Cancel</button>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App3;
