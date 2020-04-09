import React from 'react';
import './ProfileFilter.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactSlider from 'react-slider';

class ProfileFilter extends React.Component {
    render() {
        return(
            <div className = {this.props.sliderClass}>
                <div className = "Filter">
                    <div className = "FilterOption">
                        <p 
                            onClick = {() => this.props.slide("instrument")} 
                            className = "Inline FilterName"
                        >
                            Instrument
                        </p>
                        <div className = "Inline FilterIcon">
                            <FontAwesomeIcon icon = {this.props.icons[0]} />
                        </div>
                    </div>
                    <div style = {this.props.sliderStyles[0]}>
                        {this.props.instrumentOptions}
                    </div>

                    <div className = "FilterOption">
                        <p 
                            onClick = {() => this.props.slide("date")} 
                            className = "Inline FilterName"
                        >
                            Date
                        </p>
                        <div className = "Inline FilterIcon">
                            <FontAwesomeIcon icon = {this.props.icons[1]} />
                        </div>
                    </div>
                    <div style = {this.props.sliderStyles[1]}>
                        <div 
                            className = {this.props.dateClasses[0]} 
                            onClick = {() => this.props.updateOrder("newFirst")} 
                        >
                            Newest to Oldest
                        </div>
                        <div 
                            className = {this.props.dateClasses[1]} 
                            onClick = {() => this.props.updateOrder("oldFirst")} 
                        >
                            Oldest to Newest
                        </div>
                    </div>

                    <div className = "FilterOption">
                        <p 
                            onClick = {() => this.props.slide("pitch")} 
                            className = "Inline FilterName"
                        >
                            Pitches
                        </p>
                        <div className = "Inline FilterIcon">
                            <FontAwesomeIcon icon = {this.props.icons[2]} />
                        </div>
                    </div>
                    <div style = {this.props.sliderStyles[2]}>
                        <div className = "SliderBox">    
                            <ReactSlider
                                className="horizontal-slider SliderMain"
                                thumbClassName="SliderThumb"
                                trackClassName="SliderTrack"
                                defaultValue={[0, 500]}
                                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                minDistance={10}
                                onAfterChange={this.props.updateDisplay}
                                min={0}
                                max={500}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileFilter;