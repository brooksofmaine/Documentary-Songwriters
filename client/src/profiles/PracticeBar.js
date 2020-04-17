import React from 'react';

import './PracticeBar.css';
import Practice from './Practice';
import ProfileFilter from './ProfileFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight, faTimes } 
        from '@fortawesome/free-solid-svg-icons';

class PracticeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false,                  // controls entire filter slider
            overlay : {                     
                width: 0,                  // shows + hides grey overlay
                height: 0 
            },
            instrumentFilterOpen : false,  // controls instrument filter slider
            dateFilterOpen       : false,  // controls date filter slider
            pitchFilterOpen      : false,  // controls pitch filter slider

            instrument : ["all"],          // controls selected instrument(s)
            order      : "newFirst",       // controls date order of practices
            minPitch   : 0,                // controls min pitch
            maxPitch   : 500,              // controls max pitch

            display : this.props.practices, // controls displayed practices,

            default : true
        };

        this.toggleFilter     = this.toggleFilter.bind(this);
        this.toggleSubfilter  = this.toggleSubfilter.bind(this);
        this.changeDateOrder  = this.changeDateOrder.bind(this);
        this.updateDisplayed  = this.updateDisplayed.bind(this);
    }

    componentDidMount() {
        // if filters default and should be displaying but not, display
        // counteracts await delay to make sure practices are rendered
        this.interval = setInterval(() => {
            if ( this.state.default ) {
                this.setState({
                    display : this.props.practices
                })
             }
        }, 500); 
    }

    // toggles if main filter is open
    toggleFilter() {

        // closes subfilters if necessary
        if ( this.state.open ) {
            this.setState({
                instrumentFilterOpen : false,
                dateFilterOpen       : false,
                pitchFilterOpen      : false
            });
        }

        // opens/closes main filter and toggles overlay
        this.setState(prevState => ({
            open  : ! prevState.open,
            overlay : prevState.open ? 
                { 
                    width  : 0,
                    height : 0
                } : 
                { 
                    width  : "100%",
                    height : "310px" 
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

    // control order of displayed practices by date; can change one at a time
    changeDateOrder(order) {
        // only reverse if actually changing direction
        if ( this.state.order !== order ) {
            this.setState(prevState => ({
                display : prevState.display.reverse()
            }));
        }

        this.setState({
            order : order
        });
    }

    // update displayed practices based on instrument(s) and pitch
    updateDisplayed(arg) {
        let lowPitch, highPitch;
        let instruments = this.state.instrument.slice();
        this.setState({
            default : false
        });

        // change instrument filter, leave pitch the same
        if ( typeof arg === "string" ) { 
            lowPitch    = this.state.minPitch;
            highPitch   = this.state.maxPitch;
            const index = this.state.instrument.indexOf(arg);

            // selected all, deselect everything else to avoid redundancy
            if ( arg === "all" && this.state.instrument[0] !== "all" ) {
                instruments = ["all"];
            }
            // selected instrument that's already selected so deselects
            else if ( index > -1 ) { 
                instruments.splice(index, 1);
            }
            // selected actual instrument that is not already selected
            else {
                // deselects all if necessary to avoid redundancy
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
        // change pitch filter, leave instrument the same
        else {
            lowPitch  = arg[0];
            highPitch = arg[1];

            this.setState({
                minPitch : lowPitch,
                maxPitch : highPitch
            });
        }

        // control actual display
        const displayedPractices = this.props.practices.filter(practice => {
            // include in display if matches pitch filter  
            if ( practice.numPitches >= lowPitch && practice.numPitches <= highPitch ) {
                // include in display if matches instrument filter
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

        // creates necessary instrument filters and selects correct ones
        // normal instruments
        const options = this.props.instruments.map(instrument => {                                  
            const formattedInstrument = instrument.charAt(0).toUpperCase() 
                                        + instrument.slice(1);

            const instrumentClass = this.state.instrument.indexOf(instrument) > -1 
                                    ? "FilterSubOptionInstrument SelectedFilterSubOption" 
                                    : "FilterSubOptionInstrument";
            const iconClass = this.state.instrument.indexOf(instrument) > -1 
                              ? "InstrumentCross" 
                              : "InstrumentCross HiddenIcon";
            const instrumentCrossStyle = this.state.instrument.indexOf(instrument) > -1 
                                          ? {} 
                                          : {color: "#fff !important"};
            return (
                <div 
                    className = {instrumentClass} 
                    onClick = {() => this.updateDisplayed(instrument)}
                > 
                    <div className = "InstrumentSubOption" >
                        {formattedInstrument}
                    </div>
                    <FontAwesomeIcon 
                        icon = {faTimes} 
                        style = {instrumentCrossStyle} 
                        className = {iconClass} 
                    />
                </div>
            )
        });
        // all option for instrument
        const instrumentClassAll = this.state.instrument[0] === "all" 
                                   ? "FilterSubOptionInstrument SelectedFilterSubOption" 
                                   : "FilterSubOptionInstrument";
        const iconClass = this.state.instrument[0] === "all" 
                          ? "InstrumentCross" 
                          : "InstrumentCross HiddenIcon";
        const instrumentCrossStyleAll = this.state.instrument[0] === "all" 
                                        ? {} 
                                        : {color: "#fff !important"};
        options.unshift(
            
            <div 
                className = {instrumentClassAll} 
                onClick = {() => this.updateDisplayed("all")}
            >
                <div className = "InstrumentSubOption" >
                    All
                </div>
                <FontAwesomeIcon 
                    icon = {faTimes} 
                    style = {instrumentCrossStyleAll} 
                    className = {iconClass} 
                />
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
        const sliderStyles = [
                                instrumentSliderStyle, 
                                dateSliderStyle, 
                                pitchSliderStyle
                             ];

        // controls how date filters look
        const newToOldClass = this.state.order == "newFirst" 
                              ? "FilterSubOption SelectedFilterSubOption" 
                              : "FilterSubOption";
        const oldToNewClass = this.state.order == "oldFirst" 
                              ? "FilterSubOption SelectedFilterSubOption" 
                              : "FilterSubOption";    
        const dateClasses   = [newToOldClass, oldToNewClass];


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
                activeFilterString = activeFilterString.slice(0, 8) 
                                     + formattedInstrument + ", " 
                                     + activeFilterString.slice(8);
            }
        }
        else {
            activeFilterString = activeFilterString.slice(0, 8) 
                                 + "All Instruments, " 
                                 + activeFilterString.slice(8);
        }

        // controls icons
        const topIcon        = this.state.open ? faMinus : faAngleDown ;
        const instrumentIcon = this.state.instrumentFilterOpen ? faAngleDown : faAngleRight ;
        const dateIcon       = this.state.dateFilterOpen ? faAngleDown : faAngleRight ;
        const pitchIcon      = this.state.pitchFilterOpen ? faAngleDown : faAngleRight ;
        const subIcons       = [instrumentIcon, dateIcon, pitchIcon];

        
        // creates which practices are displayed
        const practiceRows = this.state.display.map(practice => {
            let date = new Date(practice.endTime);
            let dateObject = {
                "month" : date.getMonth(),
                "day" : date.getDate(),
                "year" : date.getFullYear()
            }

            let length = practice.endTime - practice.startTime;
            let lengthObject = {
                "hours" : ("0" + Math.floor(length / 3600000)).slice(-2),
                "minutes" : ("0" + (Math.floor(length / 60000) % 60)).slice(-2),
                "seconds" : ("0" + (Math.floor(length / 1000) % 60)).slice(-2)
            }
            return (
                <Practice 
                    date        = {dateObject}
                    length      = {lengthObject}
                    pitches     = {practice.numPitches}
                    instrument  = {practice.instrument}
                    key         = {practice.createdAt}
                    description = {practice.description}
                />
            )
        });

        return(
            <div className = "Container">
                <div className = "PracticeBar">
                    <div>
                        <p onClick = {this.toggleFilter} className = "InstrTitle">
                            {activeFilterString}
                        </p>
                        <span>
                            <FontAwesomeIcon icon = {topIcon} className = "Icon" />
                        </span>
                    </div>
                    <ProfileFilter 
                        slide             = {this.toggleSubfilter}
                        updateOrder       = {this.changeDateOrder}
                        updateDisplay     = {this.updateDisplayed}

                        instrumentOptions = {options}

                        icons             = {subIcons}
                        sliderStyles      = {sliderStyles}  
                        dateClasses       = {dateClasses}
                        sliderClass       = {sliderClass}
                    />
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