class Chorus {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.bypass = false;
    this.depthControl = document.querySelector("#chorusDepth");
    this.speedControl = document.querySelector("#chorusSpeed");
    this.mixControl = document.querySelector("#chorusMix");
    this.hiPassControl = document.querySelector("#chorusHiPass");
    this.loPassControl = document.querySelector("#chorusLoPass");
    this.bypassControl = document.querySelector("#chorusBypass");
    this.splitter = this.audioCtx.createChannelSplitter(1);
    this.merger = this.audioCtx.createChannelMerger(1);
    this.delayNode = this.audioCtx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.02;
    this.delayGain = this.audioCtx.createGain();
    this.delayGain.gain.value = 0.7;
    this.cleanGain = this.audioCtx.createGain();
    this.cleanGain.gain.value = 0.5
    this.hiPass = this.audioCtx.createBiquadFilter();
    this.hiPass.type = "highpass";
    this.hiPass.frequency.value = parseInt(this.hiPassControl.value);
    this.loPass = this.audioCtx.createBiquadFilter();
    this.loPass.type = "lowpass"
    this.loPass.frequency.value = parseInt(this.loPassControl.value);

    // I had to do a BOATLOAD of funky ass shit to stay out of decimal land and avoid that javscript decimal bullshit
    this.modVal = 200;
    this.counter = 0;
    this.depth = 50;
    this.speed = 500;
    this.chorusGo = true;
    this.tableLength = 10;

    this.chorusTable = Array.from(new Array(this.tableLength), (x, i) => this.depth / this.tableLength)
    this.chorusTableRev = Array.from(new Array(this.tableLength), (x, i) => -this.depth / this.tableLength)
    this.chorusTableHalf = this.chorusTable.concat(this.chorusTableRev)
    this.chorusTableHalf2 = this.chorusTableRev.concat(this.chorusTable)
    this.chorusTableFull = this.chorusTableHalf.concat(this.chorusTableHalf2)
    // console.log(this.chorusTableFull);

    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    this.input.connect(this.cleanGain);
    this.delayNode.connect(this.hiPass);
    this.hiPass.connect(this.loPass);
    this.loPass.connect(this.output);
    this.cleanGain.connect(this.output);

    this.cycle = () => {
      this.modVal += this.chorusTableFull[this.counter++];
      // console.log(this.modVal);
      this.delayNode.delayTime.value = this.modVal * 0.0001
      console.log(this.delayNode.delayTime.value)
      if (this.counter === this.chorusTableFull.length){
        this.counter = 0;
        this.cycle();
      }
    }
    if (this.chorusGo){
      this.intervalID = setInterval(this.cycle, this.speed)
    }
    this.depthControl.oninput = () => {
      this.depth = parseInt(this.depthControl.value);
      clearInterval(this.intervalID);
      if (this.chorusGo){
        this.intervalID = setInterval(this.cycle, this.speed);
      }
    };
    this.speedControl.oninput = () => {
      this.speed = parseInt(this.speedControl.value);
      clearInterval(this.intervalID);
      if (this.chorusGo){
        this.intervalID = setInterval(this.cycle, this.speed);
      }
    }
    this.mixControl.oninput = () => {
      console.log(parseFloat(this.mixControl.value));
      this.delayNode.gain.value = parseFloat(this.mixControl.value) + 0.1;
      this.cleanGain.gain.value = 0.1 / parseFloat(this.mixControl.value)
    }
    this.hiPassControl.oninput = () => {
      console.log(parseFloat(this.hiPassControl.value));
      this.hiPass.frequency.value = parseFloat(this.hiPassControl.value);
    }
    this.loPassControl.oninput = () => {
      console.log(parseFloat(this.loPassControl.value));
      this.loPass.frequency.value = parseFloat(this.loPassControl.value);
    }
    this.bypassControl.onchange = () => {
      this.bypass = !this.bypass;
      if (this.bypass) {
        clearInterval(this.intervalID);
        this.input.connect(this.output);
      }
      else{
        this.intervalID = setInterval(this.cycle, this.speed)
        this.input.connect(this.delayGain);
        this.delayGain.connect(this.delayNode);
        this.input.connect(this.cleanGain);
        this.delayNode.connect(this.hiPass);
        this.hiPass.connect(this.loPass);
        this.loPass.connect(this.output);
        this.cleanGain.connect(this.output);

      }
    }



  }
}
