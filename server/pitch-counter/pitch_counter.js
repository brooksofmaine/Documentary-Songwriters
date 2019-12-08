//use get_pitch_count to get pitch!

const Application = function() {
  this.tuner = new Tuner()

  //use get_pitch_count to get pitch!
  this.get_pitch_count = function () { return this.tuner.counter; }

  }

Application.prototype.start = function() {
  const self = this
  // var ricker = d3_peaks.ricker;
  // var findPeaks = d3_peaks.findPeaks()
  //   .kernel(ricker)
  //   .gapThreshold(1)
  //   .minLineLength(2)
  //   .minSNR(1.0)
  //   .widths([1,2,3]);
  // var convolve = d3_peaks.convolve()
  //                       .kernel(ricker);

  this.tuner.onNoteDetected = function(note) {

        self.tuner.analyser.getFloatFrequencyData(self.frequencyData)

        if (self.lastNote != note.name && Math.abs(note.cents) < 40) {
          self.tuner.counter++;

          // d3.json("signal.json", function(error, json) {

            // var peaks = findPeaks(self.frequencyData);
            // var conv = convolve(self.frequencyData);


          // }
          // console.log(peaks[5].index);
          // d3_peaks.findPeaks(self.frequencyData);

        }


        document.getElementById('counter').innerHTML = self.get_pitch_count();
        document.getElementById('cents').innerHTML = note.cents//self.tuner.getCents(440, note);
        self.lastNote = note.name
        self.last_cents = note.cents;
        
        var data = [{
        y: self.frequencyData,
          type: 'scatter',
          }];

        var data1 = [{
        y: conv,
          type: 'scatter',
          }];


        Plotly.newPlot('myDiv', data, {}, {showSendToCloud:true});
        Plotly.newPlot('myDiv1', data1, {}, {showSendToCloud:true});


  }

  swal('Welcome online tuner!').then(function() {
    self.tuner.init();
    self.frequencyData = new Float32Array(self.tuner.analyser.frequencyBinCount);
  })

  // if (!/Android/i.test(navigator.userAgent)) {
  //   this.updateFrequencyBars()
  // }
}



const app = new Application();
app.start();