class Panner {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    // UI STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    this.pannerSpeed = document.querySelector("#pannerSpeed");
    this.pannerWidth = document.querySelector("#pannerWidth");
    this.pannerStartStop = document.querySelector("#pannerStartStop");
    this.pannerBypass = document.querySelector("#pannerBypass");
    // PANNER GUTS XXXXXXXXXXXXXXXXXXXXXXXXX
    this.panner = audioCtx.createStereoPanner();

    this.pannerOsc = this.audioCtx.createOscillator();
    this.pannerOsc.start

    // console.log(this.panner.positionX);
    // this.pannerSpeed.oninput = () => {
    //   this.pannerOsc.frequency.value = parseFloat(this.pannerSpeed.value);
    //   this.pannerOsc.connect(this.panner.positionX)
    //
    //   console.log(this.pannerOsc.frequency.value);
    // }
    // temporary bullshit to try and figureout why the osciallator isn't changing the
    this.pannerWidth.oninput = () => {
      this.panner.pan.value = parseFloat(this.pannerWidth.value)
      console.log(this.panner.pan.value);
    }
    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.panner)
    this.panner.connect(this.audioCtx.destination)

  }
}
