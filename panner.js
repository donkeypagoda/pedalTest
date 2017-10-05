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

// AUTO PAN STUFF XXXXXXXXXXXXXXXXXXXXXXXXX
    let panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    // panner.coneInnerAngle = 360;

    let pannerOsc = audioCtx.createOscillator();
    pannerSpeed.oninput = () => {
      pannerOsc.frequency.value = parseFloat(pannerSpeed.value);

    }
    console.log(pannerOsc);
    console.log(panner.positionX);
    pannerOsc.connect(panner.positionX)
    pannerOsc.start

    source.connect(panner)
    panner.connect(audioCtx.destination)

  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
