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
    this.depth = 15;
    this.speed = 500;
    this.chorusGo = true;
    this.tableLength = 50;
    this.chorusTable = Array.from(new Array(50), (x, i) => 1/(i + (this.depth/50)));
    // this.chorusTable = Array.from(new Array(this.tableLength), (x, i) => i / ((this.tableLength + (Math.sqrt(this.depth))) / this.depth) + 1 / this.depth)
    // this.chorusTable = Array.from(Array(this.depth),(x,i)=>i)
    console.log(this.chorusTable);

    this.cycle = () => {
      this.delayNode.delayTime.linearRampToValueAtTime(this.delayNode.delayTime.value + this.depth, this.speed)
      this.delayNode.delayTime.linearRampToValueAtTime(this.delayNode.delayTime.value - 2 * this.depth, this.speed)
      if (this.chorusGo){
        this.cycle();
      }
    }

    // if (this.chorusGo){
    //   this.intervalID = setInterval(this.cycle(), this.speed)
    // }
    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX


  }
}
