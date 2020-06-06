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
            <select>
                <option value="piano">Piano</option>
                <option value="clarinet">Clarinet</option>
                <option value="voice">Voice</option>
            </select>
            <InstrumentPage />
        </div>

    )
}

export default SummaryPage