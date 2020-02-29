import React from 'react';

import './PracticeBar.css';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight, faTimes } 
        from '@fortawesome/free-solid-svg-icons';
import ReactSlider from 'react-slider';

class PracticeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false,
            style : { overflowY : 'auto' },
            overlay : { 
                width: 0, 
                height: 0 
            },
            instrumentFilterOpen : false,
            dateFilterOpen       : false,
            pitchFilterOpen      : false,

            instrument : ["all"],
            order      : "newFirst",
            minPitch : 0,
            maxPitch : 500,

            display : this.props.practices
        }

        this.toggleFilter     = this.toggleFilter.bind(this);
        this.toggleSubfilter  = this.toggleSubfilter.bind(this);
        this.changeDateOrder  = this.changeDateOrder.bind(this);
        this.updateDisplayed  = this.updateDisplayed.bind(this);
    }

    // toggles if main filter is open
    toggleFilter() {

        if ( this.state.open ) {
            this.setState({
                instrumentFilterOpen : false,
                dateFilterOpen       : false,
                pitchFilterOpen      : false
            })
        }

        this.setState(prevState => ({
            open  : ! prevState.open,
            overlay : prevState.open ? 
                { 
                    width: 0,
                    height: 0
                } : 
                { 
                    width: "100%",
                    height: "310px" 
                }
            
        }));
    }

    // toggles if instrument, date, and pitch subfilters are open
    toggleSubfilter(subfilter) {
        if ( subfilter === "instrument" ) {
            this.setState(prevState => ({
                instrumentFilterOpen : ! prevState.instrumentFilterOpen
            }));
        }
        else if ( subfilter === "date" ) {
            this.setState(prevState => ({
                dateFilterOpen : ! prevState.dateFilterOpen
            }));
        }
        else {
            this.setState(prevState => ({
                pitchFilterOpen : ! prevState.pitchFilterOpen
            }));
        }
    }  

    changeDateOrder(order) {
        if ( this.state.order !== order ) {
            this.setState(prevState => ({
                display : prevState.display.reverse()
            }))
        }

        this.setState({
            order : order
        })
    }

    updateDisplayed(arg) {
        let lowPitch, highPitch;
        let instruments = this.state.instrument.slice();

        if ( typeof arg === "string" ) { // instrument 
            
            lowPitch  = this.state.minPitch;
            highPitch = this.state.maxPitch;
            const index = this.state.instrument.indexOf(arg);

            // selected all, deselect everything else to avoid redundancy
            if ( arg === "all" && this.state.instrument[0] !== "all" ) {
                instruments = ["all"];
            }
            // selected actual instrument that is already selected, hence deselecting
            else if ( index > -1 ) { 
                instruments.splice(index, 1);
            }
            // selected actual instrument that is not already selected
            else {
                let allIndex = this.state.instrument.indexOf("all");

                if ( allIndex > -1 ) {
                    instruments.splice(allIndex, 1);
                }
                instruments.push(arg);
            }

            this.setState({
                instrument : instruments
            });
            
        }
        else { // pitch

            lowPitch = arg[0];
            highPitch = arg[1];

            this.setState({
                minPitch : lowPitch,
                maxPitch : highPitch
            })
        }
        const displayedPractices = this.props.practices.filter(practice => {
                
            if ( practice.pitches >= lowPitch && practice.pitches <= highPitch ) {
                if ( instruments[0] === "all" ) {
                    return true;
                }
                else {
                    for ( let i = 0; i < instruments.length; i++ ) {
                        if ( practice.instrument === instruments[i] ) {
                            return true;
                        } 
                    }
                    return false;
                }
            }
            else {
                return false;
            }
        });

        this.setState({
            display : displayedPractices
        });
    }

    render() {

        console.log("AT RENDER: " + this.state.instrument)
        // filters by instrument
        const options = this.props.instruments.map(instrument => {                                  
            const formattedInstrument = instrument.charAt(0).toUpperCase() 
                                        + instrument.slice(1);

            const instrumentClass = this.state.instrument.indexOf(instrument) > -1 ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
            const instrumentCrossStyle = this.state.instrument.indexOf(instrument) > -1 ? {} : {color: "#fff !important"};
            return (
                <div className = {instrumentClass} onClick = {() => this.updateDisplayed(instrument)}> 
                    <div className = "InstrumentSubOption" >{formattedInstrument}</div>
                    <FontAwesomeIcon icon = {faTimes} style = {instrumentCrossStyle} className = "InstrumentCross" />
                </div>
            )
        });

        const instrumentClassAll = this.state.instrument[0] === "all" ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
        const instrumentCrossStyleAll = this.state.instrument[0] === "all" ? {} : {color: "#fff !important"};
        options.unshift(
            
            <div className = {instrumentClassAll} onClick = {() => this.updateDisplayed("all")}>
                <div className = "InstrumentSubOption" >All</div>
                <FontAwesomeIcon icon = {faTimes} style = {instrumentCrossStyleAll} className = "InstrumentCross" />
            </div>
        );




        // controls which filters are showing
        const sliderClass = this.state.open ? 'Slider' : 'Slider SlideOut';
        const instrumentSliderStyle = this.state.instrumentFilterOpen ? 
            {
                overflow: "hidden"
            } : 
            {
                overflow: "hidden",
                height: 0
            }
        const dateSliderStyle = this.state.dateFilterOpen ? 
            {
                overflow: "hidden"
            } : 
            {
                overflow: "hidden",
                height: 0
            }
        const pitchSliderStyle = this.state.pitchFilterOpen ? 
            {
                overflow: "hidden"
            } : 
            {
                overflow: "hidden",
                height: 0
            }




        const newToOldClass = this.state.order == "newFirst" ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
        const oldToNewClass = this.state.order == "oldFirst" ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";    



        // controls filter string
        let activeFilterString = "Filter";
        if ( this.state.order === "newFirst" ) {
            activeFilterString = activeFilterString + " (Newest to Oldest)";
        }
        else {
            activeFilterString = activeFilterString + " (Oldest to Newest)";   
        }
        activeFilterString = activeFilterString.slice(0, 8) 
                             + this.state.minPitch + " to " 
                             + this.state.maxPitch + " Pitches, " 
                             + activeFilterString.slice(8); 
        if ( this.state.instrument[0] !== "all" ) {
            for ( let i = 0; i < this.state.instrument.length; i++ ) {
                const formattedInstrument = this.state.instrument[i].charAt(0).toUpperCase() 
                                            + this.state.instrument[i].slice(1);
                activeFilterString = activeFilterString.slice(0, 8) + formattedInstrument + ", " + activeFilterString.slice(8);
            }
        }
        else {
            activeFilterString = activeFilterString.slice(0, 8) + "All Instruments, " + activeFilterString.slice(8);
        }




        const topIcon        = this.state.open ? faMinus : faAngleDown ;
        const instrumentIcon = this.state.instrumentFilterOpen ? faAngleDown : faAngleRight ;
        const dateIcon       = this.state.dateFilterOpen ? faAngleDown : faAngleRight ;
        const pitchIcon      = this.state.pitchFilterOpen ? faAngleDown : faAngleRight ;

        const practiceRows = this.state.display.map(practice =>
            <Practice 
                date       = {practice.date}
                length     = {practice.length}
                pitches    = {practice.pitches}
                instrument = {practice.instrument}
                key        = {practice.key}
            />);

        return(
            <div className = "Container">

                <div className = "PracticeBar">
                    <div>
                        <p onClick = {this.toggleFilter} className = "InstrTitle">{activeFilterString}</p>
                        <span><FontAwesomeIcon icon = {topIcon} className = "Icon" /></span>
                    </div>
                    <div className = {sliderClass}>
                        <div className = "Filter">
                            <div className = "FilterOption">
                                <p onClick = {() => this.toggleSubfilter("instrument")} className = "Inline FilterName">Instrument</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {instrumentIcon} /></div>
                            </div>
                            <div style = {instrumentSliderStyle}>
                                {options}
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {() => this.toggleSubfilter("date")} className = "Inline FilterName">Date</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {dateIcon} /></div>
                            </div>
                            <div style = {dateSliderStyle}>
                                <div className = {newToOldClass} onClick = {() => this.changeDateOrder("newFirst")} >Newest to Oldest</div>
                                <div className = {oldToNewClass} onClick = {() => this.changeDateOrder("oldFirst")} >Oldest to Newest</div>
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {() => this.toggleSubfilter("pitch")} className = "Inline FilterName">Pitches</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {pitchIcon} /></div>
                            </div>
                            <div style = {pitchSliderStyle}>
                                <div className = "SliderBox">    
                                    <ReactSlider
                                        className="horizontal-slider SliderMain"
                                        thumbClassName="SliderThumb"
                                        trackClassName="SliderTrack"
                                        defaultValue={[0, 500]}
                                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                        minDistance={10}
                                        onAfterChange={this.updateDisplayed}
                                        min={0}
                                        max={500}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "PracticeContainer">
                        <div className = "PracticeOverlay" style = {this.state.overlay}></div>
                        <div className = "PracticeHeader">
                            <div className = "HeaderRow">   
                                <div className = "HeaderColumn Date">Date</div>
                                <div className = "HeaderColumn Length">Length</div>
                                <div className = "HeaderColumn Instrument">Instrument</div>
                                <div className = "HeaderColumn Pitch">Pitches</div>
                            </div>
                        </div>
                        <div className = "PracticeBox">
                            {practiceRows}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PracticeBar;