import React from 'react';

import './PracticeBar.css';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown } from '@fortawesome/free-solid-svg-icons';

class PracticeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false,
            style : { overflowY : 'hidden' }
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {

        this.setState(prevState => ({
            open : ! prevState.open,
            style : prevState.open ? { overflowY : 'hidden' } : { overflowY : 'auto' }
            
        }));
    }

    render() {

        // section title
        const title = this.props.instrument.type.charAt(0).toUpperCase() 
                      + this.props.instrument.type.slice(1) + ' Practices';

        const practices = this.props.instrument.practices.map(practice =>
            <Practice 
                date    = {practice.date}
                length  = {practice.length}
                pitches = {practice.pitches}
                key     = {practice.key}
            />);

        const sliderClass = this.state.open ? 'Slider' : 'Slider SlideOut';

        const icon = this.state.open ? faAngleDown : faMinus ;
        console.log(icon);

        return(
            <div className = "Container">
                <div className = "PracticeBar">
                    <div>
                        <p onClick = {this.toggle} className = "InstrTitle">{title}</p>
                        <span><FontAwesomeIcon icon = {icon} className = "Icon" /></span>
                    </div>
                    <div className = {sliderClass}>
                        <div className = "PracticeHeader">
                            <div className = "HeaderRow">   
                                <div className = "HeaderColumn Date">Date</div>
                                <div className = "HeaderColumn Length">Length</div>
                                <div className = "HeaderColumn Pitch">Pitches</div>
                            </div>
                        </div>
                        <div className = "PracticeBox" style = {this.state.style}>
                            {practices}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PracticeBar;