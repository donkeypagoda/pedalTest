// THE AUDIO PROCESSESING
const audioCtx = new AudioContext();
if (navigator.mediaDevices.getUserMedia) {
  console.log("yah buddy getUserMedia is down with the plan");
  navigator.mediaDevices.getUserMedia({audio: { latency: 0.01,
                                                echoCancellation: false,
                                                mozNoiseSuppression: false,
                                                mozAutoGainControl: false
                                      }})
  .then ((stream) => {
    const source = audioCtx.createMediaStreamSource(stream);
    return source;
  })
  .then((source) => {
    return new Disto(audioCtx, source);
  })
  .then((disto) => {
    return new Chorus(audioCtx, disto.output)
  })
  .then((chorus) => {
    return new Delay(audioCtx, chorus.output)
  })
  .then((delay) => {
    return new Reverb(audioCtx, delay.output)
  })
  .then((reverb) => {
    return new Panner(audioCtx, reverb.output)
  })
  .then((panner) => {
    return panner.output.connect(audioCtx.destination)
  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
