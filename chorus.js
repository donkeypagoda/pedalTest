class Chorus {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.bypass = false;
    this.speedControl = document.querySelector("#chorusSpeed");
    this.depthControl = document.querySelector("#chorusDepth");
    this.mixControl = document.querySelector("#chorusMix");
    this.hiPassControl = document.querySelector("#chorusHiPass");
    this.loPassControl = document.querySelector("#chorusLoPass");
    this.bypassControl = document.querySelector("#chorusBypass");
    this.delayNode = this.audioCtx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.02;
    // I had to do a BOATLOAD of funky ass shit to stay out of decimal land and avoid that javscript decimal bullshit
    this.modulation = 200;
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

    console.log(this.chorusTableFull);

    this.cycle = () => {
      this.modulation += this.chorusTableFull[this.counter++];
      // console.log(this.modulation);
      this.delayNode.delayTime.value = this.modulation * 0.0001
      console.log(this.delayNode.delayTime.value)
      if (this.counter === this.chorusTableFull.length){
        this.counter = 0;
        this.cycle();
      }
    }

    if (this.chorusGo){
      this.intervalID = setInterval(this.cycle, this.speed)
    }
    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX


  }
}
