// we use `import axios from "axios"` which is another way of saying `const axios = require("axios")`
// it is jsut better supported in the browser!
import axios from "axios";

//alchemy ftw
const apiKey = "iV9Rjt5iMP4Ci8TDngI2rWaohTB2WvZW"
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;

//start with null strings for address and url
var ownerAddr = "";
var imageUrl = "";
var imgName = "";
var imgDesc = "";
//add an event listener using a const so we can reuse it.
const submitButton = document.getElementById("submit-button");
// configure the axios request with base url and blank owner address
var config = {
    method: 'get',
    url: `${baseURL}?owner=${ownerAddr}`

}
//click the button and get whatever is inside the text box id address-input
submitButton.addEventListener("click", function () {
    const addressInput = document.getElementById("address-input");
    ownerAddr = addressInput.value;
    //this line clears out the div with each submit and puts the owner's address up top
    document.getElementById(`all-nfts`).innerHTML = "<BR />";
    //set the config with the actual owner address
    config = {
        method: 'get',
        url: `${baseURL}?owner=${ownerAddr}`
    }
    axios(config)
        .then((response) => {
            console.log(response.data)
            //we need the main table div
            //this will hold the rows
            const tableRow = document.createElement("div");
            tableRow.classList.add('nft-row');
            //we should be seting a const instead of using response.data.ownedNfts
            var allNFTs = response.data.ownedNfts;
            allNFTs.forEach(element => {
                //assign values to variables
                imgName = element.metadata.name;
                imageUrl = element.media[0].gateway;
                imgDesc = element.metadata.description;
                //create a div for each image column
                const tableColumn = document.createElement("div");
                tableColumn.classList.add('nft-column');

                //set the name for each image
                const displayName = document.createElement("h2")
                displayName.innerHTML = imgName;

                //create a div for each NFT
                const displayImage = document.createElement("div");
                displayImage.classList.add('nft-display');

                var img = new Image();
                // img.width = 200;
                // img.height = 200;
                if (element.error != null || element.media[0].gateway === ``) {
                    console.log(`no image`)
                }
                else {
                    if (imageUrl.startsWith(`ipfs://`)) {
                        console.log(imageUrl)
                        imageUrl = "https://ipfs.io/ipfs/" + imageUrl.slice(7)
                    }
                    img.src = imageUrl;
                    console.log(imgName)
                    //instead of the below, use the H1, h2, h3 span created above for each
                    //   document.getElementById("nft-h3").innerHTML += element.metadata.name
                    //   document.getElementById("all-nfts").appendChild(img);
                    displayImage.appendChild(img);
                    tableColumn.appendChild(displayName);
                    tableColumn.appendChild(displayImage);
                    tableRow.appendChild(tableColumn);
                }
            });
            //append the rows to the main container.
            document.getElementById("all-nfts").appendChild(tableRow);
       })
        .catch(error => console.log(error));
});