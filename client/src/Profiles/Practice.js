import React from 'react';

import './Practice.css';

class Practice extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let dateStr;
        switch(this.props.date.month) {
            case 1:
                dateStr = 'January';
                break;
            case 2:
                dateStr = 'February';
                break;
            case 3:
                dateStr = 'March';
                break;
            case 4:
                dateStr = 'April';
                break;
            case 5:
                dateStr = 'May';
                break;
            case 6:
                dateStr = 'June';
                break;
            case 7:
                dateStr = 'July';
                break;
            case 8:
                dateStr = 'August';
                break;
            case 9:
                dateStr = 'September';
                break;
            case 10:
                dateStr = 'October';
                break;
            case 11:
                dateStr = 'November';
                break;
            case 12:
                dateStr = 'December';
                break
        }

        let minuteStr;
        if ( this.props.length.minutes < 10 ) {
            minuteStr = '0' + this.props.length.minutes;
        }
        else {
            minuteStr = this.props.length.minutes;
        }

        return(
            <div className = "Practice">
                <div className = "PracticeCol Date PaddedDate">
                    <p>
                        {dateStr + ' ' 
                         + this.props.date.day + ', ' 
                         + this.props.date.year}
                    </p>
                </div>
                <div className = "PracticeCol Length">
                    {this.props.length.hours + ':' + minuteStr}
                </div>
                <div className = "PracticeCol Pitch PaddedPitch">
                    {this.props.pitches}
                </div>
            </div>
        )
    }
}

export default Practice;