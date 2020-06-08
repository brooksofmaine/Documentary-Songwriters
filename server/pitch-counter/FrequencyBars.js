const FrequencyBars = function() {
    this.canvas = document.createElement("CANVAS");
    this.canvas.style.position = "absolute";
    this.canvas.style.bottom = "0";
    this.canvas.style.left = "0";
    this.canvas.style.margin = "0";
    this.canvas.style.padding = "0";

    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.fillStyle = '#d9d9d9'
    document.body.appendChild(this.canvas);
}

var x = 0;

function newNote() {
    x = (x + 1) % 3;
}

var timer;

FrequencyBars.prototype.updateFrequencyBars = function(data) {
    this.canvas.setAttribute("width", window.innerWidth);
    this.canvas.setAttribute("height", (window.innerHeight / 2));
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    cancelAnimationFrame(timer);
    if (x == 0)
        this.update4(data);
    if (x == 1)
        this.update3(data);
    if (x == 2)
        this.update2(data);
}

FrequencyBars.prototype.update2 = function(data) {
    const length = 50 // low frequency only
    var width = this.canvas.width / length;
    var buffer = width / 2;
    width -= buffer;
    for (var i = 0; i < length; i += 1) {
        var rectHeight = (361 + data[i] * 3) / (361 / this.canvas.height);
        var greyScale = rectHeight / 2;

        this.canvasContext.fillStyle =
            'rgb(' + (152 - greyScale) + ', ' +
            (182 - greyScale) + ',' +
            (215 - greyScale) +')';

        this.canvasContext.fillRect(
            i * (width + buffer) + buffer / 2,
            this.canvas.height / 2 - (rectHeight) / 2,
            width,
            rectHeight
        )
    }
    timer = requestAnimationFrame(this.update2.bind(this));
}

FrequencyBars.prototype.update3 = function(data) {
    const length = 75 // low frequency only
    var width = this.canvas.width / length;
    var buffer = width / 2;
    width -= buffer;
    for (var i = 0; i < length; i += 1) {
        var rectHeight = (361 + data[i] * 3) / (361 / this.canvas.height);
        var greyScale = rectHeight / 2;

        this.canvasContext.fillStyle =
            'rgb(' + (152 - greyScale) + ', ' +
            (182 - greyScale) + ',' +
            (215 - greyScale) +')';

        this.canvasContext.fillRect(
            i * (width + buffer) + buffer / 2,
            this.canvas.height / 2 - (rectHeight) / 2,
            width,
            rectHeight
        )
    }
    timer = requestAnimationFrame(this.update3.bind(this));
}

FrequencyBars.prototype.update4 = function(data) {
    const length = 100 // low frequency only
    var width = this.canvas.width / length;
    var buffer = width / 2;
    width -= buffer;
    for (var i = 0; i < length; i += 1) {
        var rectHeight = (361 + data[i] * 3) / (361 / this.canvas.height);
        var greyScale = rectHeight / 2;

        this.canvasContext.fillStyle =
            'rgb(' + (152 - greyScale) + ', ' +
            (182 - greyScale) + ',' +
            (215 - greyScale) +')';

        this.canvasContext.fillRect(
            i * (width + buffer) + buffer / 2,
            this.canvas.height / 2 - (rectHeight) / 2,
            width,
            rectHeight
        )
    }
    timer = requestAnimationFrame(this.update4.bind(this));
}

  FrequencyBars.prototype.updateTime = function(data) {
      this.canvasContext.fillStyle = '#d9d9d9'
    const length = 200 // low frequency only
    const width = this.canvas.width / length - 3;
    for (var i = 0; i < length; i += 1) {
          this.canvasContext.fillRect(
            i * (width + 3),
            this.canvas.height / 2 - (300-data[i] * 2) / 2,
            width,
            300 - data[i] * 2
          )
      }
      timer = requestAnimationFrame(this.updateTime.bind(this));
}

const frequencyBars = new FrequencyBars();
module.exports = frequencyBars;
