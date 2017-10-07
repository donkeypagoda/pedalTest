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
    // return new Delay(audioCtx, source, audioCtx.destination);
    // return new Panner(audioCtx, source, audioCtx.destination);
<<<<<<< HEAD
    // return new Disto(audioCtx, source, audioCtx.destination);
    return new Reverb(audioCtx, source, audioCtx.destination);
=======
    // return new Reverb(audioCtx, input, audioCtx.destination);
    return new Disto(audioCtx, source, audioCtx.destination);
>>>>>>> disto
  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
