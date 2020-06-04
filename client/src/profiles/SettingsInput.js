import React, {useState} from "react"
import './SettingsInput.css'

function SettingsInput(props) {
    const [isValid, setIsValid] = useState(true)

    const handleChange = (e) => {
        if (props.validityFunction(e.target.value)) {
            props.setValue(e.target.value)
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    
    return(
        <span>
        <input 
            type={props.type}
            disabled={isValid}
            className={isValid ? 'SettingsInput' : 'invalid-input'}
            onChange={handleChange}
            value={value}
            id={props.id}/>
        <p className={isValid ? 'error-input hidden' : 'error-input'}>{props.errorMessage}</p>
        </span>
    )
}

export default SettingsInput