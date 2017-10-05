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
    delay.delayTime.value = "0.25";
    this.feedback = audioCtx.createGain();
    feedback.gain.value = 0.0;
    this.delayMute = audioCtx.createGain();
    delayMute.gain.value = 1.0;
    this.feedbackMute = audioCtx.createGain();
    feedbackMute.gain.value = 1.0;
    this.delayPassThru = audioCtx.createGain();
    delayPassThru.gain.value = 0.5;
    this.delayMixMute = audioCtx.createGain();
    delayMixMute.gain.value = 0.5;

    // ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    input.connect(delayMute);
    input.connect(delayPassThru);
    delayMute.connect(delay);
    delay.connect(feedbackMute);
    feedbackMute.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayMixMute);
    delayMixMute.connect(output)
    delayPassThru.connect(output);

    // UI XXXXXXXXXXXXXXXXXXXXXXXXX
    time.onchange = () => {
      // this is getting moved over to the delay.kontrol.js, but I really don't want it that way
      console.log(parseFloat(time.value) / 100);
      delay.delayTime.value = parseFloat(time.value) / 100;
    };
    feedbackSlider.oninput = () => {
      feedback.gain.value = feedbackSlider.value;
    };
    delayWetDryMix.oninput = () => {
      console.log(parseFloat(0.01 / delayWetDryMix.value));
      console.log(parseFloat(delayWetDryMix.value));
      delayMixMute.gain.value = 0.01 / parseFloat(delayWetDryMix.value)
      delayPassThru.gain.value = parseFloat(delayWetDryMix.value)
    }
    delayBypass.onchange = () => {
      delayBypassStatus = !delayBypassStatus;
      // console.log(delayBypassStatus);
      if (delayBypassStatus) {
        delayMute.gain.value = 0.0;
      }
      else {
        delayMute.gain.value = 1.0;
      }
    }
    feedbackBypass.onchange = () => {
      feedbackBypassStatus = !feedbackBypassStatus;
      // console.log(feedbackBypassStatus);
      if (feedbackBypassStatus) {
        feedbackMute.gain.value = 0.0;
      }
      else {
        feedbackMute.gain.value = 1.0
      }
    }
  }
}
