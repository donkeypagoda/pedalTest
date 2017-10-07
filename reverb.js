class Reverb {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.bypass = false;
    this.reverbSelect = document.querySelector("#reverbSelect");
    this.reverbAmount = document.querySelector("#reverbAmount");
    this.reverbMix = document.querySelector("#reverbMix");
    this.reverbHiPass = document.querySelector("#reverbHiPass");
    this.reverbLoPass = document.querySelector("#reverbLoPass");
    this.reverbInputBypass = document.querySelector("#reverbInputBypass");
    this.reverbBypass = document.querySelector("#reverbBypass");
    this.reverb = this.audioCtx.createConvolver();
    this.reverbInputGain = this.audioCtx.createGain();
    this.reverbInputGain.gain.value = 0.5;
    this.reverbOutputGain = this.audioCtx.createGain();
    this.reverbOutputGain.gain.value = 1.0;
    this.cleanGain = this.audioCtx.createGain();
    this.cleanGain.gain.value = 0.5;
    this.loPass = this.audioCtx.createBiquadFilter();
    this.hiPass = this.audioCtx.createBiquadFilter();
    this.reverbChoice = "/media/concert-crowd.ogg"

    this.getImpulseResponse = new XMLHttpRequest()
      this.getImpulseResponse.open("GET", this.reverbChoice, true);
      this.getImpulseResponse.responseType = "arraybuffer";
      this.getImpulseResponse.onload = () => {
        this.audioCtx.decodeAudioData(this.getImpulseResponse.response,
          (buffer) => { this.reverb.buffer = buffer });
      }
    this.getImpulseResponse.send();


    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.reverbInputGain);
    this.input.connect(this.cleanGain);
    this.reverbInputGain.connect(this.reverb);
    this.cleanGain.connect(this.output);
    this.reverb.connect(this.reverbOutputGain);
    this.reverbOutputGain.connect(this.output);

    this.reverbMix.oninput = () => {
      // this.reverbInputGain.gain.value = parseFloat(this.reverbMix.value);
      this.reverbOutputGain.gain.value = parseFloat(this.reverbMix.value);
      this.cleanGain.gain.value = 0.1 / parseFloat(this.reverbMix.value);
    }


    this.reverbBypass.onchange = () => {
      this.bypass = !this.bypass;
      if (this.bypass) {
        this.reverbOutputGain.gain.value = 0.0;
      }
      else {
        this.reverbOutputGain.gain.value = parseFloat(this.reverbMix.value)
      }
    }

  }
}
