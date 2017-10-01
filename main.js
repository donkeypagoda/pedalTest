// DOM ELEMENTS AND VARIABLES
let time = document.querySelector('#delayTime');
let feedbackSlider = document.querySelector("#delayFeedback");
let delayBypass = document.querySelector("#delayBypass");
let delayBypassStatus = false;
let feedbackBypass = document.querySelector("#feedbackBypass");
let feedbackBypassStatus = false;


// THE AUDIO PROCESSESING
if (navigator.mediaDevices.getUserMedia) {
  console.log("yah buddy getUserMedia is down with the plan");
  navigator.mediaDevices.getUserMedia({audio: true})
  .then ((stream) => {
    let audioCtx = new AudioContext();
    let source = audioCtx.createMediaStreamSource(stream);

// DELAY STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    let delay = audioCtx.createDelay();
    delay.delayTime.value = "0.25"

    let feedback = audioCtx.createGain();
    feedback.gain.value = 0.0;

    let delayMute = audioCtx.createGain();
    delayMute.gain.value = 1.0

    let feedbackMute = audioCtx.createGain();
    feedbackMute.gain.value = 1.0

    // let delaySplitter = audioCtx.createChannelSplitter(2)
    // let delayMerger = audioCtx.createChannelMerger(2)

    time.oninput = () => {
      delay.delayTime.value = time.value;
    };
    feedbackSlider.oninput = () => {
      // console.log(feedbackSlider.value);
      feedback.gain.value = feedbackSlider.value;
    };
    delayBypass.onchange = () => {
      delayBypassStatus = !delayBypassStatus;
      console.log(delayBypassStatus);
      if (delayBypassStatus) {
        delayMute.gain.value = 0.0;
      }
      else {
        delayMute.gain.value = 1.0;
      }
    }
    feedbackBypass.onchange = () => {
      feedbackBypassStatus = !feedbackBypassStatus;
      console.log(feedbackBypassStatus);
      if (feedbackBypassStatus) {
        feedbackMute.gain.value = 0.0;
      }
      else {
        feedbackMute.gain.value = 1.0
      }
    }

// DELAY ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    source.connect(delayMute);
    delayMute.connect(delay);
    delay.connect(feedbackMute);
    feedbackMute.connect(feedback);
    feedback.connect(delay);
    delay.connect(audioCtx.destination);


  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
