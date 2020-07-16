import React from 'react';

import './RecordFilter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown } from '@fortawesome/free-solid-svg-icons';

/*
 * RecordFilter
 * Second-level component, child of Record
 * Handles logic of instrument filter opening, closing, and selecting
 */
class RecordFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instrument: this.props.defaultInstrument, // selected instrument
            open: false,                              // if filter open
            altered : false,                          // initialized or not
            pendingInstrument: ""                     // tracks if instrument waiting to be changed
        }

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    /*
     * Called when component mounts
     * Sets interval to repeatedly check for instrument until it's initialized
     * Done to account for delay in fetching this from API
     */
    componentDidMount() {
        this.interval = setInterval(() => {
            if ( !this.state.altered ) {
                this.setState({ 
                    instrument: this.props.defaultInstrument
                })
            }
        }, 500); 
    }

    /*
     * Toggle filter
     * Opens/closes instrument filter
     * Triggered on click to the main filter
     */
    toggleFilter() {
        this.setState(prevState => ({
            open  : ! prevState.open,
        }));
    }

    /*
     * Set instrument
     * Displays cautionary popup if necessary
     * Called on click to a new instrument within the filter
     * instrument parameter: string representing instrument to select
     */
    setInstrument(instrument) {
        this.setState({
            pendingInstrument: instrument
        })

        // if changing instrument mid-recording, cues popup
        if ( instrument !== this.state.instrument ) {
            this.props.stopFunction();
            this.props.changeInstrument("stop", "instrument");
        }
    }

    /*
     * Change instrument
     * Changes instrument by taking data from own state
     * Only deals with front end (back end is done in Record.js)
     */
    changeInstrument() {
        this.setState(prevState => ({
            instrument : prevState.pendingInstrument,
            altered : true
        }));
    }

    /*
     * Clear pending
     * Clears out pending instrument field to be ready for another change
     */
    clearPending() {
        this.setState({
            pendingInstrument: ""
        });
    }

    /*
     * Renders main instrument filter and (if open) all instrument options
     */
    render() {

        const voiceStyle      = this.state.instrument === "Voice" ? { fontWeight : 400 } : { fontWeight : 200 };
        const pianoStyle      = this.state.instrument === "Piano" ? { fontWeight : 400 } : { fontWeight : 200 };
        const guitarStyle     = this.state.instrument === "Guitar" ? { fontWeight : 400 } : { fontWeight : 200 };
        const stringsStyle    = this.state.instrument === "Strings" ? { fontWeight : 400 } : { fontWeight : 200 };
        const woodwindStyle   = this.state.instrument === "Woodwinds" ? { fontWeight : 400 } : { fontWeight : 200 };
        const brassStyle      = this.state.instrument === "Brass" ? { fontWeight : 400 } : { fontWeight : 200 };
        const percussionStyle = this.state.instrument === "Percussion" ? { fontWeight : 400 } : { fontWeight : 200 };

        return(
            <div className="InstrumentSelectContainer Front">
                <span className="RecordHeading" onClick={this.toggleFilter}>{this.state.instrument}</span>
                <FontAwesomeIcon icon = {this.state.open ? faMinus : faAngleDown} className = "RecordFilterIcon" />
                <div className = {this.state.open ? 'RecordSlider' : 'RecordSlider SlideOut'}>
                    <div className="RecordFilter">
                        <div className = "RecordFilterOption" style={voiceStyle} onClick={() => this.setInstrument("Voice")}>Voice</div>
                        <div className = "RecordFilterOption" style={pianoStyle} onClick={() => this.setInstrument("Piano")}>Piano</div>
                        <div className = "RecordFilterOption" style={guitarStyle} onClick={() => this.setInstrument("Guitar")}>Guitar</div>
                        <div className = "RecordFilterOption" style={stringsStyle} onClick={() => this.setInstrument("Strings")}>Strings</div>
                        <div className = "RecordFilterOption" style={woodwindStyle} onClick={() => this.setInstrument("Woodwinds")}>Woodwinds</div>
                        <div className = "RecordFilterOption" style={brassStyle} onClick={() => this.setInstrument("Brass")}>Brass</div>
                        <div className = "RecordFilterOption" style={percussionStyle} onClick={() => this.setInstrument("Percussion")}>Percussion</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecordFilter;
        