import React from 'react';

import './PracticeBar.css';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';

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
            lengthFilterOpen     : false,
            pitchFilterOpen      : false,

            instrument : "all",
            order      : "newFirst",

            display : []
        }

        this.toggle           = this.toggle.bind(this);
        this.toggleInstrument = this.toggleInstrument.bind(this);
        this.toggleDate       = this.toggleDate.bind(this);
        this.toggleLength     = this.toggleLength.bind(this);
        this.togglePitch      = this.togglePitch.bind(this);
        this.selectInstrument = this.selectInstrument.bind(this);
        this.changeDateOrder  = this.changeDateOrder.bind(this);
    }

    componentDidMount() {
        this.selectInstrument("all");
    }

    toggle() {

        if ( this.state.open ) {
            this.setState({
                instrumentFilterOpen : false,
                dateFilterOpen       : false,
                lengthFilterOpen     : false,
                pitchFilterOpen      : false
            })
        }

        this.setState(prevState => ({
            open  : ! prevState.open,
            // style : prevState.open ? { overflowY : 'hidden' } : { overflowY : 'auto' }
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

    toggleLength() {
        this.setState(prevState => ({
            lengthFilterOpen : ! prevState.lengthFilterOpen
        }));
    }

    togglePitch() {
        this.setState(prevState => ({
            pitchFilterOpen : ! prevState.pitchFilterOpen
        }));
    }

    selectInstrument(instrument) {

        const displayedPractices = this.props.practices.filter(practice => {
            if ( instrument === "all" ) {
                return true;
            }
            else {
                return practice.instrument === instrument   
            }
        });

        this.setState({
            instrument : instrument,
            display    : displayedPractices
        })
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

    render() {

        // filters by instrument
        const options = this.props.instruments.map(instrument => {                                  
            const formattedInstrument = instrument.charAt(0).toUpperCase() 
                                        + instrument.slice(1);
            console.log(formattedInstrument)

            return (
                <div className = "FilterSubOption" onClick = {() => this.selectInstrument(instrument)} >{formattedInstrument}</div>
            )
        });

        options.unshift(
            <div className = "FilterSubOption" onClick = {() => this.selectInstrument("all")}>All</div>
        );





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





        const topIcon        = this.state.open ? faMinus : faAngleDown ;
        const instrumentIcon = this.state.instrumentFilterOpen ? faAngleDown : faAngleRight ;
        const dateIcon       = this.state.dateFilterOpen ? faAngleDown : faAngleRight ;
        const lengthIcon     = this.state.lengthFilterOpen ? faAngleDown : faAngleRight ;
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
                        <p onClick = {this.toggle} className = "InstrTitle">Filter</p>
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
                                <div className = "FilterSubOption" onClick = {() => this.changeDateOrder("newFirst")} >Newest to Oldest</div>
                                <div className = "FilterSubOption" onClick = {() => this.changeDateOrder("oldFirst")} >Oldest to Newest</div>
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {this.toggleLength} className = "Inline FilterName">Length</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {lengthIcon} /></div>
                            </div>

                            <div className = "FilterOption">
                                <p onClick = {this.togglePitch} className = "Inline FilterName">Pitches</p>
                                <div className = "Inline FilterIcon"><FontAwesomeIcon icon = {pitchIcon} /></div>
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