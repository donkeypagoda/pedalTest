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
    // 

  })
  .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
}
else {
    console.log('getUserMedia not supported round deez partz');
}
