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
    this.counter = 0;
    this.depth = 5;
    this.speed = 500;
    this.chorusGo = true;
    this.tableLength = 25;
    // is the line below cleaner than the one below it?  the whole thing could do with a good spin cycle
    // this.chorusTable = Array.from(new Array(50), (x, i) => this.depth - i * (this.depth * 0.02));

    this.chorusTable = Array.from(new Array(this.tableLength + 1), (x, i) => i * (this.depth * (1 / this.tableLength)));
    this.chorusTableRev = Array.from(new Array(this.tableLength), (x, i) => this.depth - i * (this.depth * (1 / this.tableLength)));
    this.chorusTableFull = this.chorusTable.concat(this.chorusTableRev)

    // console.log(this.chorusTable);

    this.cycleDown = () => {
      this.delayNode.delayTime.value += 0.01 * this.chorusTable[this.counter++];
      console.log(this.delayNode.delayTime.value);
      if(this.counter === this.chorusTable.length - 1) {
        this.delayNode.delayTime.value -= 0.01 * this.chorusTable[this.counter--];
      }
    }

    //
    if (this.chorusGo){
      this.intervalID = setInterval(this.cycleDown, 250)
    }
    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX


  }
}
