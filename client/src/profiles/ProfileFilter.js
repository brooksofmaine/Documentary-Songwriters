import React, { useState, useEffect } from 'react';
import './ProfileFilter.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactSlider from 'react-slider';

/*
 * Low-level component to render the filter and options for the profile page
 * Child of PracticeBar
 * Receives props for icons, classes, styles, instrument options, etc.
 * All render logic handled in parent component
 */
function ProfileFilter(props) {
    
    let instrumentOptions = [];
    let icons = [faAngleRight, faAngleRight, faAngleRight];
    let sliderStyles = [{}, {}, {}];
    let dateClasses = ["", ""];
    let sliderClass = "";

    /*
     * Renders main filter
     * Renders instrument subfilter (multiple choice with "all" and all instruments previously played)
     * Renders date subfilter (newest first or oldest first, order only)
     * Renders pitch subfilter (slider on a scale from 0 to 100 or the most pitches ever played, whichever's bigger)
     */
    return(
        <div className = {props.sliderClass}>
            <div className = "Filter">
                <div className = "FilterOption">
                    <p 
                        onClick = {() => props.slide("instrument")} 
                        className = "Inline FilterName"
                    >
                        Instrument
                    </p>
                    <div className = "Inline FilterIcon">
                        <FontAwesomeIcon icon = {props.icons === undefined ? icons[0] : props.icons[0]} />
                    </div>
                </div>
                <div style = {props.sliderStyles[0]}>
                    {props.instrumentOptions}
                </div>

                <div className = "FilterOption">
                    <p 
                        onClick = {() => props.slide("date")} 
                        className = "Inline FilterName"
                    >
                        Date
                    </p>
                    <div className = "Inline FilterIcon">
                        <FontAwesomeIcon icon = {props.icons === undefined ? icons[1] : props.icons[1]} />
                    </div>
                </div>
                <div style = {props.sliderStyles[1]}>
                    <div 
                        className = {props.dateClasses[0]} 
                        onClick = {() => props.updateOrder("newFirst")} 
                    >
                        Newest to Oldest
                    </div>
                    <div 
                        className = {props.dateClasses[1]} 
                        onClick = {() => props.updateOrder("oldFirst")} 
                    >
                        Oldest to Newest
                    </div>
                </div>

                <div className = "FilterOption">
                    <p 
                        onClick = {() => props.slide("pitch")} 
                        className = "Inline FilterName"
                    >
                        Pitches
                    </p>
                    <div className = "Inline FilterIcon">
                        <FontAwesomeIcon icon = {props.icons === undefined ? icons[2] : props.icons[2]} />
                    </div>
                </div>
                <div style = {props.sliderStyles[2]}>
                    <div className = "SliderBox">    
                        <ReactSlider
                            className="horizontal-slider SliderMain"
                            thumbClassName="SliderThumb"
                            trackClassName="SliderTrack"
                            defaultValue={[0, props.maxPitches]}
                            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                            minDistance={10}
                            onAfterChange={props.updatePitch}
                            min={0}
                            max={props.maxPitches}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileFilter;
