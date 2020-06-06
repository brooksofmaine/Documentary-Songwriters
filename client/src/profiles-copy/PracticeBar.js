import React, { useState, useEffect } from 'react';
import { capFirstLetter } from './capitalization';
import './PracticeBar.css';
import ProfileFilter from './ProfileFilter';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight, faTimes } 
        from '@fortawesome/free-solid-svg-icons';

function PracticeBar(props) {
    const [mainFilterOpen, setMainFilterOpen] = useState(false); // bool if main filter open
    const [overlay, setOverlay] = useState({                     // style of grey overlay
        width: 0,
        height: 0
    });
    const [instrumentFilterOpen, setInstrumentFilterOpen] = useState(false);      // bool if instrument subfilter open
    const [dateFilterOpen, setDateFilterOpen]             = useState(false);      // bool if date subfilter open
    const [pitchFilterOpen, setPitchFilterOpen]           = useState(false);      // bool if pitch subfilter open
    const [activeFilterString, setActiveFilterString]     = useState("Filter");   // string of curr active filters

    const [instrument, setInstrument] = useState(["all"]);    // array of curr selected instruments
    const [order, setOrder]           = useState("newFirst"); // string rep order of practices
    const [minPitch, setMinPitch]     = useState(0);          // min pitch to display
    const [maxPitch, setMaxPitch]     = useState(500);        // max pitch to display

    const [instrumentOptions, setInstrumentOptions] = useState(["all"]);
    const [display, setDisplay]         = useState([]);         // array of practices curr displayed
    const [rows, setRows]               = useState([]);
    
    const [sliderClass, setSliderClass]   = useState('Slider SlideOut'); // controls appearance of main filter  
    const [sliderStyles, setSliderStyles] = useState([                   // controls appearance of three subfilters
        { overflow: "hidden", height: 0 }, 
        { overflow: "hidden", height: 0 }, 
        { overflow: "hidden", height: 0 }
    ]);
    const [dateClasses, setDateClasses] = useState([      // controls appearance of date subfilters
        "FilterSubOption SelectedFilterSubOption", 
        "FilterSubOption"
    ]);
    const [topIcon, setTopIcon]   = useState(faAngleDown); // controls icon at main filter
    const [subIcons, setSubIcons] = useState([             // controls icons in 3 subfilters
        faAngleRight, 
        faAngleRight, 
        faAngleRight
    ]);

    useEffect(() => {
        setDisplay(props.practices);
    }, [props.practices])
    
    useEffect(() => {
        // creates list of all possible renderable practices
        let practiceRows;
        practiceRows = display.map(practice => {
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

        setRows(practiceRows);
    }, [display])

    // creates necessary instrument filters
    // updates once on first render
    useEffect(() => {
        const options = props.instruments.map(instr => {
            const formattedInstrument = capFirstLetter(instr);

            return (
                <div className = {"FilterSubOptionInstrument"} onClick = {() => changeSelectedInstruments(instr)}> 
                    <div className = "InstrumentSubOption">{formattedInstrument}</div>
                    <FontAwesomeIcon 
                        icon = {faTimes} 
                        style = {{color: "#fff !important"}} 
                        className = {"InstrumentCross HiddenIcon"} 
                    />
                </div>
            )
        })
        options.unshift(
            <div className = {"FilterSubOptionInstrument SelectedFilterSubOption"} onClick = {() => changeSelectedInstruments("all")}> 
                <div className = "InstrumentSubOption">All</div>
                <FontAwesomeIcon 
                    icon = {faTimes} 
                    style = {{}} 
                    className = {"InstrumentCross"} 
                />
            </div>
        );
        setInstrumentOptions(options);
    }, [props.instruments])

    useEffect(() => {
        // normal instruments
        let options;
        options = props.instruments.map(instr => {                                  
            
            const formattedInstrument = capFirstLetter(instr);
            const alreadySelected = instrument.indexOf(instr) > -1;
            const instrumentClass = alreadySelected ? 
                "FilterSubOptionInstrument SelectedFilterSubOption" : "FilterSubOptionInstrument";
            const iconClass = alreadySelected ? 
                "InstrumentCross" : "InstrumentCross HiddenIcon";
            const instrumentCrossStyle = alreadySelected ? 
                {} : {color: "#fff !important"};
            return (
                <div className = {instrumentClass} onClick = {() => changeSelectedInstruments(instr)}> 
                    <div className = "InstrumentSubOption">{formattedInstrument}</div>
                    <FontAwesomeIcon 
                        icon = {faTimes} 
                        style = {instrumentCrossStyle} 
                        className = {iconClass} 
                    />
                </div>
            )
        })

        // all option for instrument
        const instrumentClassAll = instrument[0] === "all" ? 
            "FilterSubOptionInstrument SelectedFilterSubOption" : "FilterSubOptionInstrument";
        const iconClass = instrument[0] === "all" ? 
            "InstrumentCross" : "InstrumentCross HiddenIcon";
        const instrumentCrossStyleAll = instrument[0] === "all" ? 
            {} : {color: "#fff !important"};
        options.unshift(
            <div className={instrumentClassAll} onClick = {() => changeSelectedInstruments("all")}>
                <div className="InstrumentSubOption">All</div>
                <FontAwesomeIcon 
                    icon      = {faTimes} 
                    style     = {instrumentCrossStyleAll} 
                    className = {iconClass} 
                />
            </div>
        );
        setInstrumentOptions(options);
    }, [instrument])

    // controls how date filters look and condenses into array
    useEffect(() => {
        const newToOldClass = order === "newFirst" ? 
            "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
        const oldToNewClass = order === "oldFirst" ? 
            "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";    
        setDateClasses([newToOldClass, oldToNewClass]);
    }, [order])

    // controls which filters are showing and condenses info into array
    useEffect(() => {
        setSliderClass(mainFilterOpen ? 'Slider' : 'Slider SlideOut');
        
        const instrumentSliderStyle = instrumentFilterOpen ? 
            { overflow: "hidden" } : { overflow: "hidden", height: 0 };
        const dateSliderStyle = dateFilterOpen ? 
            { overflow: "hidden" } : { overflow: "hidden", height: 0 };
        const pitchSliderStyle = pitchFilterOpen ? 
            { overflow: "hidden" } : { overflow: "hidden", height: 0 };

        setSliderStyles([instrumentSliderStyle, dateSliderStyle, pitchSliderStyle]);

        const instrumentIcon = instrumentFilterOpen ? faAngleDown : faAngleRight ;
        const dateIcon       = dateFilterOpen ? faAngleDown : faAngleRight ;
        const pitchIcon      = pitchFilterOpen ? faAngleDown : faAngleRight ;
        setSubIcons([instrumentIcon, dateIcon, pitchIcon]);
    }, [mainFilterOpen, instrumentFilterOpen, dateFilterOpen, pitchFilterOpen])

    // updates active filter string based on active filters
    useEffect(() => {
        let tempFilterString = "Filter";
        console.log(order)
        if ( order === "newFirst" ) {
            tempFilterString += " (Newest to Oldest)";
        }
        else {
            tempFilterString += " (Oldest to Newest)";   
        }
        tempFilterString = tempFilterString.slice(0, 8) 
                            + minPitch + " to " 
                            + maxPitch + " Pitches, " 
                            + tempFilterString.slice(8); 
        if ( instrument[0] !== "all" ) {
            for ( let i = 0; i < instrument.length; i++ ) {
                const formattedInstrument = instrument[i].charAt(0).toUpperCase() 
                                            + instrument[i].slice(1);
                tempFilterString = tempFilterString.slice(0, 8) 
                                    + formattedInstrument + ", " 
                                    + tempFilterString.slice(8);
            }
        }
        else {
            tempFilterString = tempFilterString.slice(0, 8) 
                                + "All Instruments, " 
                                + tempFilterString.slice(8);
        }
        setActiveFilterString(tempFilterString);
        
    }, [instrument, minPitch, maxPitch, order])

    // updates which practices display and which don't
    useEffect(() => {
        // control actual display
        const displayedPractices = props.practices.filter(practice => {
            // include in display if matches pitch filter  
            if ( practice.numPitches >= minPitch && practice.numPitches <= maxPitch ) {
                // include in display if matches instrument filter
                if ( instrument[0] === "all" ) {
                    return true;
                }
                else {
                    for ( let i = 0; i < instrument.length; i++ ) {
                        if ( practice.instrument === instrument[i] ) {
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
        setDisplay(displayedPractices);
    }, [instrument, minPitch, maxPitch])

    // toggles if main filter is open, triggered on click
    function toggleFilter() {
        // closes subfilters if necessary
        if ( mainFilterOpen ) {
            setInstrumentFilterOpen(false);
            setDateFilterOpen(false);
            setPitchFilterOpen(false);
        }

        // opens/closes main filter and toggles overlay
        const nowOpen = !mainFilterOpen;
        setMainFilterOpen(nowOpen);
        setOverlay(nowOpen ? { width : "100%", height : "310px" } : { width : 0, height : 0});
        setSliderClass(nowOpen ? 'Slider' : 'Slider SlideOut');
        setTopIcon(nowOpen ? faMinus : faAngleDown);
    }

    // toggles if instrument, date, and pitch subfilters are open, triggers on click
    function toggleSubfilter(subfilter) {
        if ( subfilter === "instrument" ) {
            setInstrumentFilterOpen(!instrumentFilterOpen);
        }
        else if ( subfilter === "date" ) {
            setDateFilterOpen(!dateFilterOpen);
        }
        else {
            setPitchFilterOpen(!pitchFilterOpen);
        }
    }  

    // control order of displayed practices by date; can change one at a time
    // triggers on click from ProfileFilter props
    function changeDateOrder(newOrder) {
        // only reverse if actually changing direction
        if ( newOrder !== order ) {
            setOrder(newOrder);
            const newDisplay = display.slice().reverse();
            setDisplay(newDisplay);
        }
    }

    // control which instruments should be shown
    // triggers on click from ProfileFilter props
    function changeSelectedInstruments(newInstrument) {
        const index = instrument.indexOf(newInstrument);
        let instruments = instrument;

        // selected all, deselect everything else to avoid redundancy
        if ( newInstrument === "all" && instrument[0] !== "all" ) {
            instruments = ["all"];
        }
        // selected instrument that's already selected so deselects
        else if ( index > -1 ) { 
            instruments.splice(index, 1);
        }
        // selected actual instrument that is not already selected
        else {
            // deselects all if necessary to avoid redundancy
            let allIndex = instrument.indexOf("all");
            if ( allIndex > -1 ) {
                instruments.splice(allIndex, 1);
            }

            instruments.push(newInstrument);
        }
        setInstrument(instruments.slice());
    }

    // controls which pitch range should be shown
    // triggers on click from ProfileFilter props
    function changeSelectedPitches(pitches) {
        setMinPitch(pitches[0]);
        setMaxPitch(pitches[1]);
    }

    return(
        <div className = "Container">
            <div className = "PracticeBar">
                <div onClick={toggleFilter} className="FilterTopper">
                    <p className="InstrTitle">
                        {activeFilterString}
                    </p>
                    <span>
                        <FontAwesomeIcon icon = {topIcon} className = "Icon" />
                    </span>
                </div>
                <ProfileFilter 
                    slide             = {toggleSubfilter}
                    updateOrder       = {changeDateOrder}
                    updatePitch       = {changeSelectedPitches}
                    updateInstrument  = {changeSelectedInstruments}

                    instrumentOptions = {instrumentOptions}

                    icons             = {subIcons}
                    sliderStyles      = {sliderStyles}  
                    dateClasses       = {dateClasses}
                    sliderClass       = {sliderClass}
                />
                <div className = "PracticeContainer">
                    <div className = "PracticeOverlay" style = {overlay}></div>
                    <div className = "PracticeHeader">
                        <div className = "HeaderRow">   
                            <div className = "HeaderColumn Date">Date</div>
                            <div className = "HeaderColumn Length">Length</div>
                            <div className = "HeaderColumn Instrument">Instrument</div>
                            <div className = "HeaderColumn Pitch">Pitches</div>
                        </div>
                    </div>
                    <div className = "PracticeBox">
                        {rows}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PracticeBar;