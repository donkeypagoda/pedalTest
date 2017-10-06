class Panner {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.bypass = false;
    // UI STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    this.pannerSpeed = document.querySelector("#pannerSpeed");
    this.pannerWidth = document.querySelector("#pannerWidth");
    this.pannerStartStop = document.querySelector("#pannerStartStop");
    this.pannerBypass = document.querySelector("#pannerBypass");
    // PANNER GUTS XXXXXXXXXXXXXXXXXXXXXXXXX
    this.panner = this.audioCtx.createStereoPanner();
    this.panner.pan.value = 0;
    this.pannerTable = Array.from(new Array(200), (x, i) => i/100 + -1.0);
    this.pannerTableRev = Array.from(new Array(200), (x, i) => 1.0 - i/100);
    console.log(this.pannerTableRev);
    this.osc = this.audioCtx.createOscillator();
    // this.wave = this.audioCtx.createPeriodicWave(this.pannerTable, this.pannerTableRev);
    console.log(this.osc);
    // console.log(wave);
    // this.counter = 0;


    this.pannerSpeed.oninput = () => {
      clearInterval();
      setInterval(this.panInc, parseInt(this.pannerSpeed.value))
      console.log(parseInt(this.pannerSpeed.value));
      this.panInc = () => {
        this.panner.pan.value = this.pannerTable[this.counter++]
        // console.log(-1 + (counter++* 0.01));
        console.log(this.panner.pan.value)
        if(this.count === this.pannerTable.length - 1) {
          this.counter = 0;
          // return this.panInc();
        }
      }
    }

    this.pannerWidth.oninput = () => {
      // this.panner.pan.value = parseFloat(this.pannerWidth.value)
      // console.log(this.panner.pan.value);
    }
    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.panner)
    this.panner.connect(this.audioCtx.destination)

  }
}
