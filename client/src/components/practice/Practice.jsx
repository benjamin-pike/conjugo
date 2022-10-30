import React, { useState } from "react";
import { useNav } from "../../store/NavContext";
import Configure from "./configure_v2/Configure";
import Round from "./session/Session";
import Results from "./results/Results";

function Practice(){

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