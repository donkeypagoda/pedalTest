// DELAY UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let time = document.querySelector('#delayTime');
let feedbackSlider = document.querySelector("#delayFeedback");
let delayBypass = document.querySelector("#delayBypass");
let delayBypassStatus = false;
let feedbackBypass = document.querySelector("#feedbackBypass");
let feedbackBypassStatus = false;

// DISTO UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let distoSat = document.querySelector('#distoSat')
let distoOverdrive = document.querySelector("#distoOverdrive")
let distoSustain = document.querySelector("#distoSustain")
let distoBlend = document.querySelector("#distoBlend")
let distoHPFfreq = document.querySelector("#distoHPFfreq")

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

// DISTO STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    let distoOver = audioCtx.createGain();

    let disto1 = audioCtx.createWaveShaper();
    function makeDistortionCurve(amount) {
      let k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    }
    disto1.curve = makeDistortionCurve(400);
    disto1.oversample = '4x';

    let distoSust = audioCtx.createGain();
    let distoMix1 = audioCtx.createGain();
    let distoMix2 = audioCtx.createGain();
    let distoSplit = audioCtx.createChannelSplitter(2);
    let distoHPF = audioCtx.createBiquadFilter();
    distoHPF.type = "highpass"

    distoSat.oninput = () => {
      console.log(distoSat.value);
      disto1.curve = makeDistortionCurve(parseFloat(distoSat.value));
    };
    distoOverdrive.oninput = () => {
      console.log(parseFloat(distoOverdrive.value));
      distoOver.gain.value = parseFloat(distoOverdrive.value);
    };
    distoSustain.oninput = () => {
      distoSust.gain.value = parseFloat(distoSustain.value);
    };

    distoBlend.oninput = () => {
      distoMix1.gain.value = parseFloat(distoBlend.value);
      distoMix2.gain.value = 1 / parseFloat(distoBlend.value);
    }

    distoHPFfreq.oninput = () => {
      console.log(parseFloat(distoHPFfreq.value));
      distoHPF.frequency.value = parseFloat(distoHPFfreq.value);

    }

// DISTO ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX
    source.connect(disto1)
    // distoSplit.connect(distoOver, 0)
    // distoOver.connect(disto1)
    disto1.connect(distoSust)
    distoSust.connect(disto1)
    // disto1.connect(distoMix1)
    // distoSplit.connect(distoMix2, 1)
    disto1.connect(distoHPF)
    distoHPF.connect(audioCtx.destination)
    // distoMix1.connect(audioCtx.destination)
    // distoMix2.connect(audioCtx.destination)


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
    // distoGain2.connect(delayMute);
    // delayMute.connect(delay);
    // delay.connect(feedbackMute);
    // feedbackMute.connect(feedback);
    // feedback.connect(delay);
    // delay.connect(audioCtx.destination);


  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
