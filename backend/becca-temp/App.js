import React          from 'react';
import Counter        from './Counter';
import RecordButton   from './RecordButton';
import Heading        from './Heading';
//import Timer          from './timer';

import './RecordButton.css';
import './Heading.css';
import './Counter.css';
import './CenteredElem.css';

class App extends React.Component {
    
    constructor() {
        super();
        this.state = { count: 0 };

        this.handleOneClick = this.handleOneClick.bind(this);
        this.handleFiveClick = this.handleFiveClick.bind(this);
    }

    handleOneClick() {
        this.setState(prevState => {
            return {
                count: prevState.count + 1 
            }
        });
    }

    handleFiveClick() {
        this.setState(prevState => {
            return {
                count: prevState.count + 5 
            }
        });
    }

    render() {
        return (
            <div className="CenteredElem">
                <div className="CenteredElem">
                    <Heading />
                    <Counter count={this.state.count} />
                </div>
                <br />

                <div>
                    <RecordButton />
                    <RecordButton />
                    <RecordButton />
                </div>
                <br />
            </div>
        );
    }
    
}

export default App;
