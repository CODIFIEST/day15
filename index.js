// we use `import axios from "axios"` which is another way of saying `const axios = require("axios")`
// it is jsut better supported in the browser!
import axios from "axios";
import clearScreen from "./utils";
//alchemy ftw
const apiKey = "iV9Rjt5iMP4Ci8TDngI2rWaohTB2WvZW"
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;

var ownerAddr = "";
var imageUrl = "";
var imgName = "";
var imgDesc = "";

//add an event listener using a const so we can reuse it.
const submitButton = document.getElementById("submit-button");

//click the button and get whatever is inside the text box id address-input
submitButton.addEventListener("click", function () {
    const addressInput = document.getElementById("address-input");
    ownerAddr = addressInput.value;
    //this line clears out the div with each submit 
    clearScreen();
    //set the config with the actual owner address
    const config = {
        method: 'get',
        url: `${baseURL}?owner=${ownerAddr}`
    }
    axios(config)
        .then((response) => {
            console.log(response.data) // I like this here to review WTF I'm looking at.
            //we need the main table div- this will hold the rows
            const tableRow = document.createElement("div");
            tableRow.classList.add('nft-row');
            //we should be seting a const instead of using response.data.ownedNfts
            var allNFTs = response.data.ownedNfts;
            //loop through the array and display the nfts
            for (let i = 0; i < allNFTs.length; i++) {
                //assign values to variables
                imgName = allNFTs[i].metadata.name;
                imageUrl = allNFTs[i].media[0].gateway;
                imgDesc = allNFTs[i].metadata.description;
                //create a div for each image column
                const tableColumn = document.createElement("div");
                tableColumn.classList.add('nft-column');
                tableColumn.dataset.imgIndex = i;

                //set the name for each image
                const displayName = document.createElement("h2")
                displayName.innerHTML = imgName;

                //create a div for each NFT
                const displayImage = document.createElement("div");
                displayImage.classList.add('nft-display');

                //create span for the descriptoin
                var modal = document.getElementById("myModal");
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
                const displayDesc = document.createElement("span");
                displayDesc.classList.add('modal')
                displayDesc.innerHTML = imgDesc;

                var img = new Image();
                if (allNFTs[i].error != null || allNFTs[i].media[0].gateway === ``) {
                    console.log(`no image`)
                }
                else {
                    //ifpsToHttps
                    if (imageUrl.startsWith(`ipfs://`)) {
                        console.log(imageUrl)
                        imageUrl = "https://ipfs.io/ipfs/" + imageUrl.slice(7)
                    }
                    img.src = imageUrl;
                    console.log(imgName);
                    displayImage.appendChild(img);
                    tableColumn.appendChild(displayName);
                    tableColumn.appendChild(displayImage);
                    tableRow.appendChild(tableColumn);
                }
                // assign the description of the clicked item to the modal
                tableColumn.onclick = function () {
                    const nft = allNFTs[tableColumn.dataset.imgIndex];
                    document.getElementById("NFTdesc").innerHTML = nft.description
                    modal.style.display = "block"
                }
            };
            //append the rows to the main container.
            document.getElementById("all-nfts").appendChild(tableRow);
        })
        .catch(error => console.log(error));
});