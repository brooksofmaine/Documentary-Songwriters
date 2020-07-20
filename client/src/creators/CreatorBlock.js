import React from 'react';
import './CreatorBlock.css';

function CreatorBlock(props) {
    return(
        <div className="CreatorBlockContainer">
            <div className="CreatorBlock">
                <div className="CreatorBlockColumn">
                    <img className="ProfilePics" src={props.pic} /> 
                </div>
                <div className="CreatorBlockColumn CreatorBlockColumnRight">
                    <p className="CreatorName">{props.name}</p>
                    <p className="CreatorInfo">Tufts Class of {props.year}</p>
                    <p className="CreatorInfo">{props.role}</p>
                </div>
            </div>
        </div>
    )
}

export default CreatorBlock;