import React from 'react';

import './PracticeBar.css';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Slider from '@material-ui/core/Slider';
import ReactSlider from 'react-slider';



class PracticeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false,
            // style : { overflowY : 'hidden' }
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

        this.toggle           = this.toggle.bind(this);
        this.toggleInstrument = this.toggleInstrument.bind(this);
        this.toggleDate       = this.toggleDate.bind(this);
        this.togglePitch      = this.togglePitch.bind(this);
        this.selectInstrument = this.selectInstrument.bind(this);
        this.changeDateOrder  = this.changeDateOrder.bind(this);
        this.updateSlider     = this.updateSlider.bind(this);
    }

    componentDidMount() {
        
    }

    toggle() {

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

    toggleInstrument() {
        this.setState(prevState => ({
            instrumentFilterOpen : ! prevState.instrumentFilterOpen
        }));
    }

    toggleDate() {
        this.setState(prevState => ({
            dateFilterOpen : ! prevState.dateFilterOpen
        }));
    }

    togglePitch() {
        this.setState(prevState => ({
            pitchFilterOpen : ! prevState.pitchFilterOpen
        }));
    }

    selectInstrument(instrument) {

        const index = this.state.instrument.indexOf(instrument);

        // selected all, deselect everything else to avoid redundancy
        if ( instrument === "all" ) {
            this.setState({
                instrument : ["all"]
            })
        }
        // selected actual instrument that is already selected, hence deselecting
        else if ( index > -1 ) { 
            let instruments = this.state.instrument;
            instruments.splice(index, 1);
            if ( instruments.length === 0 ) {
                instruments = ["all"];
            }
            console.log(instruments)
            this.setState({
                instrument : instruments
            });
            console.log(this.state.instrument)
        }
        // selected actual instrument that is not already selected
        else /*if ( instrument !== "noChange" )*/ {
            let allIndex = this.state.instrument.indexOf("all");
            console.log(this.state.instrument)
            let instruments = this.state.instrument;
            if ( allIndex > -1 ) {
                instruments.splice(allIndex, 1);
            }
            instruments.push(instrument);

            this.setState({
                instrument : instruments
            });
            console.log(this.state.instrument)
        }
        const displayedPractices = this.props.practices.filter(practice => {
            if ( this.state.instrument[0] === "all" ) {
                return true;
            }
            else {
                for ( let i = 0; i < this.state.instrument.length; i++ ) {
                    if ( practice.instrument === this.state.instrument[i] ) {
                        return true;
                    } 
                }
                return false;
            }
        });

        this.setState({
            display : displayedPractices
        });

        // if ( instrument !== "noChange" ) {
        //     const values = [this.state.minPitch, this.state.maxPitch];
        //     this.updateSlider(values);
        // }
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

    updateSlider(values) {
        if ( this.state.minPitch !== values[0] && this.state.maxPitch !== values[1] ) {
            this.selectInstrument("noChange");    
        }
        console.log(values)
        const displayedPractices = this.state.display.filter(practice => {
            console.log(practice.pitches >= values[0] && practice.pitches <= values[1])
            return practice.pitches >= values[0] && practice.pitches <= values[1];
        })
        console.log(displayedPractices)
        this.setState({
            minPitch : values[0],
            maxPitch : values[1],
            display  : displayedPractices
        })
    }

    render() {

        // filters by instrument
        const options = this.props.instruments.map(instrument => {                                  
            const formattedInstrument = instrument.charAt(0).toUpperCase() 
                                        + instrument.slice(1);

            const instrumentClass = this.state.instrument.indexOf(instrument) > -1 ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
            return (
                <div className = {instrumentClass} onClick = {() => this.selectInstrument(instrument)} >{formattedInstrument}</div>
            )
        });

        const instrumentClassAll = this.state.instrument[0] === "all" ? "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
        options.unshift(
            
            <div className = {instrumentClassAll} onClick = {() => this.selectInstrument("all")}>All</div>
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

        const tempStyle = {height: 100};

        return(
            <div className = "Container">

                <div className = "PracticeBar">
                    <div>
                        <p onClick = {this.toggle} className = "InstrTitle">{activeFilterString}</p>
                        <span><FontAwesomeIcon icon = {topIcon} className = "Icon" /></span>
                    </div>
                    <div className = {sliderClass}>
                        <div className = "Filter">
                            <div className = "FilterOption">
                                <p onClick = {this.toggleInstrument} className = "Inline FilterName">Instrument</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {instrumentIcon} /></div>
                            </div>
                            <div style = {instrumentSliderStyle}>
                                {options}
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {this.toggleDate} className = "Inline FilterName">Date</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {dateIcon} /></div>
                            </div>
                            <div style = {dateSliderStyle}>
                                <div className = {newToOldClass} onClick = {() => this.changeDateOrder("newFirst")} >Newest to Oldest</div>
                                <div className = {oldToNewClass} onClick = {() => this.changeDateOrder("oldFirst")} >Oldest to Newest</div>
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {this.togglePitch} className = "Inline FilterName">Pitches</p>
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
                                        onAfterChange={this.updateSlider}
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