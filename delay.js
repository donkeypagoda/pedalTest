// DELAY UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let time = document.querySelector('#delayTime');
let feedbackSlider = document.querySelector("#delayFeedback");
let delayWetDryMix = document.querySelector("#delayWetDryMix");
let delayBypass = document.querySelector("#delayBypass");
let delayBypassStatus = false;
let feedbackBypass = document.querySelector("#feedbackBypass");
let feedbackBypassStatus = false;


// THE AUDIO PROCESSESING
if (navigator.mediaDevices.getUserMedia) {
  console.log("yah buddy getUserMedia is down with the plan");
  navigator.mediaDevices.getUserMedia({audio: { latency: 0.01,
                                                echoCancellation: false,
                                                mozNoiseSuppression: false,
                                                mozAutoGainControl: false
                                      }})
  .then ((stream) => {
    let audioCtx = new AudioContext();
    let source = audioCtx.createMediaStreamSource(stream);

// DELAY STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    let delay = audioCtx.createDelay(10.0); // this might be too long, check for memory slowness
    delay.delayTime.value = "0.25"

    let feedback = audioCtx.createGain();
    feedback.gain.value = 0.0;

    let delayMute = audioCtx.createGain();
    delayMute.gain.value = 1.0

    let feedbackMute = audioCtx.createGain();
    feedbackMute.gain.value = 1.0

    let delayPassThru = audioCtx.createGain();
    delayPassThru.gain.value = 0.5

    let delayMixMute = audioCtx.createGain();
    delayMixMute.gain.value = 0.5

    time.oninput = () => {
      console.log(parseFloat(time.value));
      delay.delayTime.value = parseFloat(time.value);
    };
    feedbackSlider.oninput = () => {
      // console.log(feedbackSlider.value);
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

// DELAY ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    source.connect(distoLPF);
    distoLPF.connect(delayMute);
    distoLPF.connect(delayPassThru);
    delayMute.connect(delay);
    delay.connect(feedbackMute);
    feedbackMute.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayMixMute);
    delayMixMute.connect(audioCtx.destination)
    delayPassThru.connect(audioCtx.destination);

  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
