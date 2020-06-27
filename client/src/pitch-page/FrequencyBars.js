import React from "react";
import './FrequencyBars.css';

class FrequencyBars extends React.Component {
    constructor() {
        super();
        this.state = {
            x : 0,
            timer : null
        }
        this.canvasRef = React.createRef();

        this.newNote = this.newNote.bind(this);
        this.updateFrequencyBars = this.updateFrequencyBars.bind(this);
        this.update2 = this.update2.bind(this);
        this.update3 = this.update3.bind(this);
        this.update4 = this.update4.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        if ( canvas !== null ) {
            const context = canvas.getContext('2d');
        }
    }
    
    newNote() {
        this.setState(prevState => ({
            x : (prevState.x + 1) % 3
        }));
    }

    updateFrequencyBars(data) {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        // context.setAttribute("width", window.innerWidth);
        // context.setAttribute("height", (window.innerHeight / 2));
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        cancelAnimationFrame(this.state.timer);
        if (this.state.x === 0)
            this.update4(data);
        if (this.state.x === 1)
            this.update3(data);
        if (this.state.x === 2)
            this.update2(data);
    }

    update2(data) {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        const length = 50 // low frequency only
        var width = canvas.width / length;
        var buffer = width / 2;
        width -= buffer;

        for (var i = 0; i < length; i += 1) {
            var rectHeight = (361 + data[i] * 3) / (361 / canvas.height);
            var greyScale = rectHeight / 2;
    
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

        this.setState({
            timer : requestAnimationFrame(this.update2)
        });
    }

    update3(data) {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        
        const length = 75 // low frequency only
        var width = canvas.width / length;
        var buffer = width / 2;
        width -= buffer;

        for (var i = 0; i < length; i += 1) {
            var rectHeight = (361 + data[i] * 3) / (361 / canvas.height);
            var greyScale = rectHeight / 2;
    
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
        
        this.setState({
            timer : requestAnimationFrame(this.update3)
        })
    }

    update4(data) {
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
            timer : requestAnimationFrame(this.update4)
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
  


    render() {
        return(
            <div className = "FrequencyBars">
                <canvas className = "FrequencyCanvas" ref={this.canvasRef}></canvas>
            </div>
        );
    }
}

export default FrequencyBars;
// const frequencyBars = new FrequencyBars();
// module.exports = frequencyBars;