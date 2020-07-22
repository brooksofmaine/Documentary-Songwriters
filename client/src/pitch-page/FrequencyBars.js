import React from "react";
import './FrequencyBars.css';

class FrequencyBars extends React.Component {
    constructor() {
        super();
        this.state = {
            timer : null
        }
        this.canvasRef = React.createRef();

        this.updateFrequencyBars = this.updateFrequencyBars.bind(this);
        this.update = this.update.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        if ( canvas !== null ) {
            const context = canvas.getContext('2d');
        }
    }

    updateFrequencyBars(data) {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        cancelAnimationFrame(this.state.timer);
        this.update(data);
    }

    update(data) {
        const canvas = this.canvasRef.current;
        let context;
        if ( canvas !== null ) {
            context = canvas.getContext('2d');
        }
        
        const length = 75 // low frequency only
        let width;
        if ( canvas !== null ) {
            width = canvas.width / length;
        }
        
        var buffer = width / 1.2;
        width -= buffer;

        for (var i = 0; i < length; i += 1) {
            let rectHeight;
            if ( canvas !== null && data !== null) {
                // console.log("data:", data)
                // console.log("canvas:", canvas)
                rectHeight = Math.floor((361 + data[i] * 3) / (361 / canvas.height));
            }
            var greyScale = rectHeight / 1.1;
    
            if ( context !== undefined ) {
                context.fillStyle =
                    'rgb(' + (152 - greyScale) + ', ' +
                    (182 - greyScale) + ',' +
                    (215 - greyScale) +')';
        
                context.fillRect(
                    i * (width + buffer) + buffer / 2 + 0.5,
                    canvas.height / 2 - (rectHeight) / 2,
                    width,
                    rectHeight
                )
            }
        }
        this.setState({
            timer : requestAnimationFrame(this.update)
        });
    }

    updateTime(data) {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        const length = 200 // low frequency only
        const width = this.canvas.width / length - 3;

        for (var i = 0; i < length; i += 1) {
            context.fillRect(
            i * (width + 3),
            canvas.height / 2 - (300-data[i] * 2) / 2,
            width,
            300 - data[i] * 2
            )
        }
        this.setState({
            timer : requestAnimationFrame(this.updateTime)
        });   
        
  }

    eraseBars() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    render() {
        return(
            <div className = "FrequencyBars">
                <canvas className = "FrequencyCanvas" ref={this.canvasRef}></canvas>
            </div>
        );
    }
}

export default FrequencyBars;