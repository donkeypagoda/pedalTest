class Delay {
  constructor(audioCtx, input, output){
    this.input = input;
    this.output = output;
    this.audioCtx = audioCtx;
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
    this.input.connect(delayMute);
    this.input.connect(delayPassThru);
    this.delayMute.connect(delay);
    this.delay.connect(feedbackMute);
    this.feedbackMute.connect(feedback);
    this.feedback.connect(delay);
    this.delay.connect(delayMixMute);
    this.delayMixMute.connect(output)
    this.delayPassThru.connect(output);

    // UI XXXXXXXXXXXXXXXXXXXXXXXXX
    this.time.onchange = () => {
      // this is getting moved over to the delay.kontrol.js, but I really don't want it that way
      console.log(parseFloat(time.value) / 100);
      delay.delayTime.value = parseFloat(time.value) / 100;
    };
    this.feedbackSlider.oninput = () => {
      feedback.gain.value = feedbackSlider.value;
    };
    this.delayWetDryMix.oninput = () => {
      console.log(parseFloat(0.01 / delayWetDryMix.value));
      console.log(parseFloat(delayWetDryMix.value));
      this.delayMixMute.gain.value = 0.01 / parseFloat(delayWetDryMix.value)
      this.delayPassThru.gain.value = parseFloat(delayWetDryMix.value)
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
