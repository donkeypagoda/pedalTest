class Delay {
  constructor(audioCtx, input, output){
    this.audioCtx = audioCtx;
    this.input = input;
    this.output = output;
    this.time = document.querySelector('#delayTime');
    this.feedbackSlider = document.querySelector("#delayFeedback");
    this.delayWetDryMix = document.querySelector("#delayWetDryMix");
    this.delayBypass = document.querySelector("#delayBypass");
    this.delayBypassStatus = false;
    this.feedbackBypass = document.querySelector("#feedbackBypass");
    this.feedbackBypassStatus = false;
    this.delay = audioCtx.createDelay(10.0); // this might be too long, check for memory slowness
    this.delay.delayTime.value = "0.25";
    this.feedback = audioCtx.createGain();
    this.feedback.gain.value = 0.0;
    this.delayMute = audioCtx.createGain();
    this.delayMute.gain.value = 1.0;
    this.feedbackMute = audioCtx.createGain();
    this.feedbackMute.gain.value = 1.0;
    this.delayPassThru = audioCtx.createGain();
    this.delayPassThru.gain.value = 0.5;
    this.delayMixMute = audioCtx.createGain();
    this.delayMixMute.gain.value = 0.5;

    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    this.input.connect(this.delayMute);
    this.input.connect(this.delayPassThru);
    this.delayMute.connect(this.delay);
    this.delay.connect(this.feedbackMute);
    this.feedbackMute.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delay.connect(this.delayMixMute);
    this.delayMixMute.connect(this.output)
    this.delayPassThru.connect(this.output);

    // UI XXXXXXXXXXXXXXXXXXXXXXXXX
    this.time.onchange = () => {
      // this is getting moved over to the delay.kontrol.js, but I really don't want it that way
      console.log(parseFloat(this.time.value));
      this.delay.delayTime.value = parseFloat(this.time.value);
    };
    this.feedbackSlider.oninput = () => {
      this.feedback.gain.value = this.feedbackSlider.value;
    };
    this.delayWetDryMix.oninput = () => {
      console.log(parseFloat(0.01 / this.delayWetDryMix.value));
      console.log(parseFloat(this.delayWetDryMix.value));
      this.delayMixMute.gain.value = 0.01 / parseFloat(this.delayWetDryMix.value)
      this.delayPassThru.gain.value = parseFloat(this.delayWetDryMix.value)
    }
    this.delayBypass.onchange = () => {
      this.delayBypassStatus = !this.delayBypassStatus;
      // console.log(delayBypassStatus);
      if (this.delayBypassStatus) {
        this.delayMute.gain.value = 0.0;
      }
      else {
        this.delayMute.gain.value = 1.0;
      }
    }
    this.feedbackBypass.onchange = () => {
      this.feedbackBypassStatus = !this.feedbackBypassStatus;
      // console.log(feedbackBypassStatus);
      if (this.feedbackBypassStatus) {
        this.feedbackMute.gain.value = 0.0;
      }
      else {
        this.feedbackMute.gain.value = 1.0
      }
    }
  }
}
