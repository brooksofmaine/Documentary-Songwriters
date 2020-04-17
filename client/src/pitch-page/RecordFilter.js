import React from 'react';

import './RecordFilter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faAngleDown } from '@fortawesome/free-solid-svg-icons';

class RecordFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instrument: this.props.defaultInstrument,
            open: false,
            altered : false
        }

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if ( !this.state.altered ) {
                this.setState({ 
                    instrument: this.props.defaultInstrument
                })
            }
        }, 500); 
    }

    // toggles if filter is open
    toggleFilter() {
        // opens/closes main filter 
        this.setState(prevState => ({
            open  : ! prevState.open,
        }));
    }

    setInstrument(instrument) {
        
        if ( instrument !== this.state.instrument ) {
            this.props.changeInstrument("stop", "instrument");

            this.setState({
                instrument : instrument,
                altered : true
            });
        }
    }

    render() {

        const pianoStyle      = this.state.instrument === "Piano" ? { fontWeight : 400 } : { fontWeight : 200 };
        const guitarStyle     = this.state.instrument === "Guitar" ? { fontWeight : 400 } : { fontWeight : 200 };
        const stringsStyle    = this.state.instrument === "Strings" ? { fontWeight : 400 } : { fontWeight : 200 };
        const woodwindStyle   = this.state.instrument === "Woodwind" ? { fontWeight : 400 } : { fontWeight : 200 };
        const brassStyle      = this.state.instrument === "Brass" ? { fontWeight : 400 } : { fontWeight : 200 };
        const percussionStyle = this.state.instrument === "Percussion" ? { fontWeight : 400 } : { fontWeight : 200 };

        return(
            <div className="InstrumentSelectContainer">
                <span className="RecordHeading" onClick={this.toggleFilter}>{this.state.instrument}</span>
                <FontAwesomeIcon icon = {this.state.open ? faMinus : faAngleDown} className = "RecordFilterIcon" />
                <div className = {this.state.open ? 'RecordSlider' : 'RecordSlider SlideOut'}>
                    <div className="RecordFilter">
                        <div className = "RecordFilterOption" style={pianoStyle} onClick={() => this.setInstrument("Piano")}>Piano</div>
                        <div className = "RecordFilterOption" style={guitarStyle} onClick={() => this.setInstrument("Guitar")}>Guitar</div>
                        <div className = "RecordFilterOption" style={stringsStyle} onClick={() => this.setInstrument("Strings")}>Strings</div>
                        <div className = "RecordFilterOption" style={woodwindStyle} onClick={() => this.setInstrument("Woodwind")}>Woodwind</div>
                        <div className = "RecordFilterOption" style={brassStyle} onClick={() => this.setInstrument("Brass")}>Brass</div>
                        <div className = "RecordFilterOption" style={percussionStyle} onClick={() => this.setInstrument("Percussion")}>Percussion</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecordFilter;
        