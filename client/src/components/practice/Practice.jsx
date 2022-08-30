import React, { useState } from "react";
import { useNav } from "../../store/NavContext";
import Configure from "./configure/Configure";
import Round from "./round/Round";
import Results from "./results/Results";

function Practice(props){

    const { displayNav } = useNav()
    const [stage, setStage] = useState("configuration")

    const [resultsData, setResultsData] = useState([])

    displayNav(stage === "configuration")

    const components = {
        configuration: <Configure setStage = {setStage}/>,
        round: <Round setStage = {setStage} resultsData = {resultsData} setResultsData = {setResultsData} />,
        results: <Results setStage = {setStage} resultsData = {resultsData}/>
    }

    return components[stage];
}

export default Practice;