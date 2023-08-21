import { useEffect, useState } from "react";
import rockPaperScissorABI from "../abi/RockPaperScissor";
import { rockPaperScissorAddress } from "../constants/contracts";

const ContractInteraction = ({score}) => {
    const [account, setAccount] = useState();
    const [highestScore, setHighestScore] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (window)
            window.parent.postMessage({ type: 'GET_ACCOUNT' }, '*');

        // Add event listener to receive messages from the parent window (website A)
        window.addEventListener('message', handleMessageFromParent);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('message', handleMessageFromParent);
        };
    }, []);

    useEffect(() => {
        if(account)
            getPlayerHighestScore();
    }, [account])

    const handleMessageFromParent = (event) => {
        console.log("child got message: ", event);
        // Ensure the message is coming from the parent window (website A)
        if (event.source === window.parent && event.data) {
            console.log("child data: ", event.data.payload)

            if (event.data.type === "ACCOUNT_STATUS")
                setAccount(event.data.payload);
            else if (event.data.type === "GET_STATUS") {
                console.log("GET_STATUS: ", event.data.payload);
                setHighestScore(parseInt(event.data.payload._hex));
            }
            else if (event.data.type === "GET_TX_STATUS") {
                console.log("GET_TX_STATUS: ", event.data);
                setIsLoading(false);
                if(event.data.functionName === "updateScore")
                    setHighestScore(event.data.params[0]);
            }
        }
    };

    function getPlayerHighestScore() {
        const functionName = 'getPlayerHighestScore',
            params = [account];

        if (window)
            window.parent.postMessage({
                type: 'CALL_FUNCTION', payload: {
                    contractAddress: rockPaperScissorAddress(137),
                    contractAbi: rockPaperScissorABI.abi,
                    functionName,
                    params
                }
            }, '*');
        // else if(chrome)
        //     chrome.tabs.sendMessage(sender.tab.id, { type: 'TRANSACTION_STATUS', payload: { functionName, params, paramTypes } });
        console.log("Sent Success: getPlayerHighestScore");
    }

    function setGameHighestScore() {
        try {
            setIsLoading(true);
            const functionName = 'updateScore',
                params = [score];
    
            if (window)
                window.parent.postMessage({
                    type: 'SEND_FUNCTION', payload: {
                        contractAddress: rockPaperScissorAddress(137),
                        contractAbi: rockPaperScissorABI.abi,
                        functionName,
                        params
                    }
                }, '*');
            // else if(chrome)
            //     chrome.tabs.sendMessage(sender.tab.id, { type: 'TRANSACTION_STATUS', payload: { functionName, params, paramTypes } });
            console.log("Sent Success: setGameHighestScore");
        } catch (error) {
            console.log("Error in setGameHighestScore: ", error);
            setIsLoading(false);
        }
    }

    return (
        <>
            <div style={{marginTop: '230px', fontSize: '20px'}}>
                <p>ERC6551 Account: {account}</p>
                <p>Highest Score: {highestScore}</p>
                {isLoading ?
                    <button style={{padding: '10px'}}>Updating Highest Score...</button> :
                    <button style={{padding: '10px'}} onClick={setGameHighestScore}>Update Highest Score</button>
                }
            </div>
        </>
    );
}

export default ContractInteraction;