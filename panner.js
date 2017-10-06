class Panner {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.bypass = false;
    // UI STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    this.pannerSpeedInput = document.querySelector("#pannerSpeed");
    this.pannerSpeed = 500;
    this.pannerWidth = document.querySelector("#pannerWidth");
    this.pannerStartStop = document.querySelector("#pannerStartStop");
    this.pannerGo = true;
    this.pannerBypass = document.querySelector("#pannerBypass");
    // PANNER GUTS XXXXXXXXXXXXXXXXXXXXXXXXX
    this.panner = this.audioCtx.createStereoPanner();
    this.panner.pan.value = 0;

    this.pannerTable = Array.from(new Array(200), (x, i) => i/100 + -1.0);
    this.pannerTableRev = Array.from(new Array(201), (x, i) => 1.0 - i/100);
    this.pannerFullTable = this.pannerTable.concat(this.pannerTableRev)

    this.counter = 0;

    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.panner)
    this.panner.connect(this.output)

    // THE ACTION XXXXXXXXXXXXXXXXXXXXXXXXX
    this.panInc = () => {
      this.panner.pan.value = this.pannerFullTable[this.counter++]
      console.log(this.panner.pan.value)
      if(this.counter === this.pannerFullTable.length - 1) {
        this.counter = 0;
        this.panInc();
      }
    }

    if (this.pannerGo) {
      this.intervalID = setInterval(this.panInc, this.pannerSpeed)
    }


    this.pannerSpeedInput.oninput = () => {
      this.pannerSpeed = parseInt(this.pannerSpeedInput.value);
    }

    this.pannerStartStop.onchange = () => {
      this.pannerGo = !this.pannerGo;
      if (this.pannerGo) {
        this.intervalID = setInterval(this.panInc, parseInt(this.pannerSpeedInput.value))
      }
      else{
        console.log(this.intervalID);
        clearInterval(this.intervalID)
      }
    }

    this.pannerWidth.oninput = () => {

    }

    this.pannerBypass.onchange = () => {
      this.bypass = !this.bypass
      if (this.bypass) {
        this.input.connect(this.output)
      }
      else {
        this.input.connect(this.panner)
        this.panner.connect(this.output)
      }
    }

  }
}
