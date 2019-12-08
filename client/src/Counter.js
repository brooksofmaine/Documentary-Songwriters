import React from 'react';
// import './pitch-counter/d3-peaks.js'
// import './pitch-counter/tuner.js'

// import { add, multiply } from './pitch-counter/counting.js'
import './Counter.css';

class Counter extends React.Component {
    constructor() {
        super();
        this.state = {counter: 0};
    }

    

    // componentDidMount() {
        
    // const script1 = document.createElement('script');
    // script1.src="//d3js.org/d3.v3.min.js"
    // document.body.appendChild(script1);

    // const script2 = document.createElement('script');
    // script2.src="./pitch-counter/d3-peaks.js"
    // document.body.appendChild(script2);

    // const script3 = document.createElement('script');
    // script3.src="./pitch-counter/tuner.js"
    // document.body.appendChild(script3);

    // const script4 = document.createElement('script');
    // script4.src="./pitch-counter/app.js"
    // document.body.appendChild(script4);

    // app.start();
    //     // console.log(add(5,3));
    // }

    handleClickPlay() {
        // app.start()
    }

    render() {
        return(
            <div className = "counterContainer">
                <h3 className="Heading">Pitch Counter</h3>
                <div onClick={this.props.handleClick} className="counterBox">
                    <p className="pitchCounter">{this.props.countNum}</p>
                </div>
            </div>
        )
    }
}

export default Counter;