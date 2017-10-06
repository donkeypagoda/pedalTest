// class Disto {
//   constructor(audioCtx, input, output){
//
//   }
// }

// DISTO UI SHIT XXXXXXXXXXXXXXXXXXXXXXXXX
let distoSat = document.querySelector('#distoSat')
let distoOverdrive = document.querySelector("#distoOverdrive")
let distoHPFfreq = document.querySelector("#distoHPFfreq")
let distoLPFfreq = document.querySelector("#distoLPFfreq")
let distoBypass = document.querySelector("#distoBypass")
let distoBypassStatus = false;

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
    distoLPF.connect(audioCtx.destination)

  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
