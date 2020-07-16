import React, {useState, useEffect} from 'react';
import './Creators.css';
import CreatorBlock from './CreatorBlock';
import {becca, anne, steven, emily, molly, isabelle, adam, yaqara, peter, yichen, harsh, will} from './profile-pics/ProfilePics';

function Creators() {
    return(
        <div className="Creators">
            <h1 className="ThinHeading">Meet the creators of <b>Tone Ticker</b></h1>
            <CreatorBlock 
                pic={anne} 
                name="Anne Lau" 
                year="2021"
                role="Project Manager"
            />
            <CreatorBlock 
                pic={peter} 
                name="Peter Lam" 
                year="2020"
                role="Front-End Developer"
            />
            <CreatorBlock 
                pic={becca} 
                name="Rebecca Miller" 
                year="2022"
                role="Front-End Developer"
            />
            <CreatorBlock 
                pic={steven} 
                name="Steven Song" 
                year="2020"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={emily} 
                name="Emily Liu" 
                year="2020"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={harsh} 
                name="Harsh Prajapati" 
                year="2021"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={yichen} 
                name="Yichen Wei" 
                year="2022"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={isabelle} 
                name="Isabelle Lai" 
                year="2022"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={will} 
                name="Will Kendall" 
                year="2021"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={adam} 
                name="Adam Peters" 
                year="2023"
                role="Back-End Developer"
            />
            <CreatorBlock 
                pic={molly} 
                name="Molly Campbell" 
                year="2020"
                role="Designer"
            />
            <CreatorBlock 
                pic={yaqara} 
                name="Yaqara Patterson" 
                year="2022"
                role="Designer"
            />
        </div>
    )
}
export default Creators;