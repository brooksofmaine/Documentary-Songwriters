import React, { useState, useEffect } from 'react';
import './PracticeBar.css';
import ProfileFilter from './ProfileFilter';
import Practice from './Practice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown, faAngleRight, faTimes } 
        from '@fortawesome/free-solid-svg-icons';

const capFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/*
 * Second level component for profile page
 * Displays filter and practices in table format
 * Controls which practices are currently showing
 * Child of UserProfile
 */
function PracticeBar(props) {
    const [mainFilterOpen, setMainFilterOpen] = useState(false); // bool if main filter open
    const [overlay, setOverlay] = useState({                     // style of grey overlay on main practice box
        width: 0,
        height: 0
    });
    const [instrumentFilterOpen, setInstrumentFilterOpen] = useState(false);    // bool if instrument subfilter open
    const [dateFilterOpen, setDateFilterOpen]             = useState(false);    // bool if date subfilter open
    const [pitchFilterOpen, setPitchFilterOpen]           = useState(false);    // bool if pitch subfilter open
    const [activeFilterString, setActiveFilterString]     = useState("Filter"); // string of current active filters

    const [instrument, setInstrument] = useState(["all"]);    // array of currently sshwoing instruments
    const [order, setOrder]           = useState("newFirst"); // string representing order of practices (newFirst or oldFirst)
    const [minPitch, setMinPitch]     = useState(0);          // min pitch to display
    const [maxPitch, setMaxPitch]     = useState(props.maxPitches);        // max pitch to display

    const [instrumentOptions, setInstrumentOptions] = useState(["all"]); // array of instrument options to display, 
                                                                         // including "all" and all instruments played by this user
    const [display, setDisplay]         = useState([]); // array of practice objects currently displayed
    const [rows, setRows]               = useState([]); // array of practice components currently displayed
    
    const [sliderClass, setSliderClass]   = useState('Slider SlideOut'); // controls appearance of main filter  
    const [sliderStyles, setSliderStyles] = useState([                   // controls appearance of three subfilters
        { overflow: "hidden", height: 0 },                                  // instrument
        { overflow: "hidden", height: 0 },                                  // date
        { overflow: "hidden", height: 0 }                                   // pitches
    ]);
    const [dateClasses, setDateClasses] = useState([ // controls appearance of date subfilters
        "FilterSubOption SelectedFilterSubOption", 
        "FilterSubOption"
    ]);
    const [topIcon, setTopIcon]   = useState(faAngleDown); // controls icon at main filter
    const [subIcons, setSubIcons] = useState([             // controls icons in 3 subfilters
        faAngleRight,                                          // instrument
        faAngleRight,                                          // date
        faAngleRight                                           // pitches
    ]);

    /* 
     * Updates displayed practices when they load from API
     */
    useEffect(() => {
        console.log("setting display")
        setDisplay(props.practices);
    }, [props.practices])
    
    /*
     * Updates rendered practice components and makes them nicely displayed
     * Called whenever filter changes display logic
     */
    useEffect(() => {
        console.log("update rendered practice")
        let practiceRows;
        practiceRows = display.map(practice => {
            // displays date in a legible format
            let date = new Date(practice.endTime);
            let dateObject = {
                "month" : date.getMonth(),
                "day" : date.getDate(),
                "year" : date.getFullYear()
            }

            // displays duration of practice in legible format
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

        // adds information into renderable state object
        setRows(practiceRows);
    }, [display])

    /*
     * Creates necessary instrument filters
     * Based on instrument(s) user has played before
     * Updates once on first render based on data from API
     */
    useEffect(() => {
        console.log("update rendered practice")
        // first create options for all actual instruments that have been previously played
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
        // then add options for "all" instruments
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
    // }, [props.instruments, changeSelectedInstruments])
        }, [props.instruments])

    /*
     * Converts every viable instrument into a clickable filter option component
     * Called once when instrument array is formed with instruments that user plays
     */
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
    // }, [instrument, changeSelectedInstruments])
    }, [instrument])

    /*
     * Controls how date filters look and condenses into array
     * Called whenever order changes to make display correctly
     */
    useEffect(() => {
        const newToOldClass = order === "newFirst" ? 
            "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";
        const oldToNewClass = order === "oldFirst" ? 
            "FilterSubOption SelectedFilterSubOption" : "FilterSubOption";    
        setDateClasses([newToOldClass, oldToNewClass]);
    }, [order])

    /* 
     * Controls which filters are showing and condenses info into array
     * Controls focus styles based on what's open currently
     * Called whenever any filter/subfilter is opened or closed
     */
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

    /*
     * Updates active filter string based on active filters
     * Called every time instrument, date, or pitch filters are changed
     */
    useEffect(() => {
        let tempFilterString = "Filter";
        // adds order filter to the filter string
        if ( order === "newFirst" ) {
            tempFilterString += " (Newest to Oldest)";
        }
        else {
            tempFilterString += " (Oldest to Newest)";   
        }
        // adds pitch filter to the filter string
        tempFilterString = tempFilterString.slice(0, 8) 
                            + minPitch + " to " 
                            + maxPitch + " Pitches, " 
                            + tempFilterString.slice(8); 
        // adds instrument filter to the filter string
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

    /*
     * Updates which practices display and which don't
     * Called every time instrument or pitch filters change
     * Note: date filter only changes order, not what's displayed
     */
    useEffect(() => {
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
    }, [instrument, minPitch, maxPitch, props.practices])

    /*
     * Triggered on click of main filter
     * Toggles if it's open or not
     * Adjusts overlay if necessary
     */
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

    /* 
     * Toggles if instrument, date, and pitch subfilters are open
     * Triggers on click of the subfilter e.g. "Instrument", "Date", "Pitch"
     * subfilter parameter takes string "instrument" or "date" or "pitch"
     */
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

    /*
     * Control order of displayed practices by date 
     * Triggers on click of date subfilter option from ProfileFilter props
     */ 
    function changeDateOrder(newOrder) {
        // only reverse if actually changing direction
        if ( newOrder !== order ) {
            setOrder(newOrder);
            const newDisplay = display.slice().reverse();
            setDisplay(newDisplay);
        }
    }

    /*
     * Control which instruments should be displayed as practices
     * Triggers on click of an instrument subfilter option from ProfileFilter props
     */
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

    /*
     * Controls which pitch range should be shown
     * Triggers on change of pitch slider from ProfileFilter props
     */
    function changeSelectedPitches(pitches) {
        setMinPitch(pitches[0]);
        setMaxPitch(pitches[1]);
    }

    /*
     * Renders filter as well as table including practices
     * Passes practice rendering logic as props
     */
    return(
        <div className = "Container">
            <div className = "PracticeBar">
                <div onClick={toggleFilter} className="FilterTopper">
                    <p className="InstrTitle">
                        {activeFilterString}
                    </p>
                    <span className="arrowIcon">
                        <FontAwesomeIcon icon = {topIcon} className = "Icon" />
                    </span>
                </div>
                <ProfileFilter 
                    slide             = {toggleSubfilter}
                    updateOrder       = {changeDateOrder}
                    updatePitch       = {changeSelectedPitches}
                    updateInstrument  = {changeSelectedInstruments}

                    instrumentOptions = {instrumentOptions}
                    maxPitches={props.maxPitches}

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