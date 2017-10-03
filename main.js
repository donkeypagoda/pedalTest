// DISTO UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let distoSat = document.querySelector('#distoSat')
let distoOverdrive = document.querySelector("#distoOverdrive")
let distoHPFfreq = document.querySelector("#distoHPFfreq")
let distoLPFfreq = document.querySelector("#distoLPFfreq")
let distoBypass = document.querySelector("#distoBypass")
let distoBypassStatus = false;

// DELAY UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let time = document.querySelector('#delayTime');
let feedbackSlider = document.querySelector("#delayFeedback");
let delayWetDryMix = document.querySelector("#delayWetDryMix");
let delayBypass = document.querySelector("#delayBypass");
let delayBypassStatus = false;
let feedbackBypass = document.querySelector("#feedbackBypass");
let feedbackBypassStatus = false;

// PANNER UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let pannerSpeed = document.querySelector("#pannerSpeed");
let pannerWidth = document.querySelector("#pannerWidth");
let pannerStartStop = document.querySelector("#pannerStartStop");
let pannerBypass = document.querySelector("#pannerBypass");


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

    let distoHPF = audioCtx.createBiquadFilter();
    distoHPF.type = "highpass"
    distoHPF.frequency.value = 60;
    let distoLPF = audioCtx.createBiquadFilter();
    distoLPF.type = "lowpass"
    distoLPF.frequency.value = 15000;


    distoSat.oninput = () => {
      // console.log(parseFloat(distoSat.value));
      disto1.curve = makeDistortionCurve(parseFloat(distoSat.value));
    };
    distoOverdrive.oninput = () => {
      // console.log(parseFloat(distoOverdrive.value));
      distoOver.gain.value = parseFloat(distoOverdrive.value);
    };

    distoHPFfreq.oninput = () => {
      // console.log(parseFloat(distoHPFfreq.value));
      distoHPF.frequency.value = parseFloat(distoHPFfreq.value);
    }
    distoLPFfreq.oninput = () => {
      // console.log(parseFloat(distoLPFfreq.value));
      distoLPF.frequency.value = parseFloat(distoLPFfreq.value);
    }
    distoBypass.oninput = (event) => {
      distoBypassStatus = !distoBypassStatus;
      if (distoBypassStatus) {
        // distoOver.gain.value = 0.0;
      }
      else {
        // distoBypassGain.gain.value = 1.0;
      }
    }

// DISTO ROUTING XXXXXXXXXXXXXXXXXXXXXXXXX

    source.connect(distoOver)
    distoOver.connect(disto1)
    disto1.connect(distoHPF)
    distoHPF.connect(distoLPF)


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

    // let delaySplitter = audioCtx.createChannelSplitter(2)
    // let delayMerger = audioCtx.createChannelMerger(2)

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
    distoLPF.connect(delayMute);
    distoLPF.connect(delayPassThru);
    delayMute.connect(delay);
    delay.connect(feedbackMute);
    feedbackMute.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayMixMute);
    delayMixMute.connect(audioCtx.destination)
    delayPassThru.connect(audioCtx.destination);



// AUTO PAN STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    let panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    // panner.coneInnerAngle = 360;



  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
