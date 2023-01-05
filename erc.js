//-------------------- ERC below this line
const baseERCURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
//click the button and get whatever is inside the text box id address-input
const ercButton = document.getElementById("erc-button");
ercButton.addEventListener("click", function () {
    const addressInput = document.getElementById("address-input");
    console.log(addressInput.value)
    ownerAddr = addressInput.value;
    //this line clears out the div with each submit and puts the owner's address up top
    document.getElementById(`all-erc20`).innerHTML = ownerAddr;
    // //set the config with the actual owner address
    //--------BELOW THIS LINE IS ERC20 ACTION
    // Data for making the request to query token balances
    const ERCdata = JSON.stringify({
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        headers: {
            "Content-Type": "application/json",
        },
        params: [`${ownerAddr}`],
        id: 42,
    });
    //   console.log(data);
    // config object for making a request with axios
    var ercConfig = {
        method: "post",
        url: baseERCURL,
        headers: {
            "Content-Type": "application/json",
        },
        data: ERCdata,
    };
    // console.log(ercConfig)
    // Data for making the request to query token balances
    async function ercDisplay() {
        let answer = await axios(ercConfig);
        answer = answer["data"];
        //get the balances
        const balances = answer["result"];
        //for loop to get all of the non zero
        let i = 1;
        //old for loop       for (let token of nonZero){
        for (let token of balances.tokenBalances) {
            let balance = token.tokenBalance;
            // console.log(balance)
            //optoins for the request
            const options = {
                method: "POST",
                url: baseERCURL,
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                },
                data: {
                    id: 1,
                    jsonrpc: "2.0",
                    method: "alchemy_getTokenMetadata",
                    params: [token.contractAddress],
                },
            };
            //get metadata
            const metadata = await axios.request(options);
            // console.log(`metadata`)
            // console.log(metadata)
            //     // Compute token balance in human-readable format
            balance = balance / Math.pow(10, metadata["data"]["result"].decimals);
            balance = balance.toFixed(2);

            // Print name, balance, and symbol of token
            // console.log(`${i++}. ${metadata["data"]["result"].name}: ${balance} ${
            //     metadata["data"]["result"].symbol
            // }`);
            if (balance > 0) {
                document.getElementById("all-erc20").innerHTML += (`<br/>${i++}. ${metadata["data"]["result"].name}: ${balance} ${metadata["data"]["result"].symbol
                    }`);
            }
        }
    }
    ercDisplay();
});