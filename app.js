let time = document.querySelector('#delayTime');
let feedbackSlider = document.querySelector("#delayFeedback");
let delayBypass = document.querySelector("#delayBypass")
let delayEngage = true;

if (navigator.mediaDevices.getUserMedia) {
  console.log("yah buddy getUserMedia is down with the plan");
  navigator.mediaDevices.getUserMedia({audio: true})
  .then ((stream) => {
    let audioCtx = new AudioContext();
    let source = audioCtx.createMediaStreamSource(stream);
    let delay = audioCtx.createDelay();

    let feedback = audioCtx.createGain();

    feedback.gain.value = 0.0;

    // routing:
    if (delayEngage) {
    source.connect(delay);
    delay.connect(audioCtx.destination);
    delay.connect(feedback);
    feedback.connect(delay);
    }
    if (!delayEngage) {
    source.connect(audioCtx.destination);
    }

    time.oninput = () => {
      delay.delayTime.value = time.value;
    };
    feedbackSlider.oninput = () => {
      // console.log(feedbackSlider.value);
      feedback.gain.value = feedbackSlider.value;
    };
    delayBypass.onchange = () => {
      delayEngage = !delayEngage
    }


  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
