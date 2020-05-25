import React, {useState} from 'react'
import InstrumentPage from './InstrumentPage'
import './SummaryPage.css'

function SummaryPage() {
    // TODO: Unfinished, needs overhaul
    const useSwitchInstruments = (callback) => {
        const [inputs, setInputs] = useState({});

        const handleSubmit = (event) => {
            if (event) {
              event.preventDefault();
            }
            callback();
          }
        return null;
    }


    return(
        <div className="SummaryPage">
            <InstrumentPage />
        </div>

    )
}

export default SummaryPage