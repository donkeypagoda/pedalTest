class Board {
  constructor(audioCtx, input, output) {
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.order = {
      "distortion": new Disto(audioCtx, input, output),
      "delay": new Delay(audioCtx, input, output),
      "panner": new Panner(audioCtx, input, output),
      "reverb": new Reverb(audioCtx, input, output)

    }
    this.order.distortion(audioCtx, input, this.order.delay.input);
    this.order.delay(audioCtx, this.)

  }
}
