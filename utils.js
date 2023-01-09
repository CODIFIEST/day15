function clearScreen() {
    document.getElementById(`all-nfts`).innerHTML = "<BR />";
}
module.exports = clearScreen


import axios from "axios";
function nftsFromAddress() {
    //this line clears out the div with each submit 
    clearScreen();
    // These variables are required for the axios call
    const apiKey = "iV9Rjt5iMP4Ci8TDngI2rWaohTB2WvZW"
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
    //this takes whatever the value input into the field when submit is clicked.
    const addressInput = document.getElementById("address-input");
    const ownerAddr = addressInput.value;
    //set the config with the actual owner address and other required fields
    const config = {
        method: 'get',
        url: `${baseURL}?owner=${ownerAddr}`
    }
    // we need a promise to wait for axios to complete or it won't know what the response is if it runs synchronously when submit is clicked
    return new Promise((resolve, reject) => {
        axios(config)
            .then((response) => {
                resolve(response);
                console.log(response.data) // I like this here to review WTF I'm looking at.
                //we need the main table div- this will hold the rows
                const tableRow = document.createElement("div");
                tableRow.classList.add('nft-row');
                //we should be seting a const instead of using response.data.ownedNfts
                var allNFTs = response.data.ownedNfts;
                //loop through the array and display the nfts
                for (let i = 0; i < allNFTs.length; i++) {
                    //assign image name and url values to variables
                    const imgName = allNFTs[i].metadata.name;
                    const imageUrl = allNFTs[i].media[0].gateway;
                    // Create a new HTML img element using the Image() constructor
                    const img = new Image();
                    //create a div for each image column and assign it the class nft-column
                    const tableColumn = document.createElement("div");
                    tableColumn.classList.add('nft-column');
                    //set the image index to the for loop counter
                    tableColumn.dataset.imgIndex = i;
                    //set the name for each image
                    const displayName = document.createElement("h2")
                    displayName.innerHTML = imgName;
                    //create a div for each NFT and assign it the class nft-display
                    const displayImage = document.createElement("div");
                    displayImage.classList.add('nft-display');
                    // if there is an error, log it to the console
                    if (allNFTs[i].error != null || allNFTs[i].media[0].gateway === ``) {
                        console.log(`no image`)
                    }
                    // if no error, validate/massage data then append to html doc.
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
                    //create the modal and link it to the html
                    var modal = document.getElementById("myModal");
                    // assign the description of the clicked item to the modal
                    tableColumn.onclick = function () {
                        const nft = allNFTs[tableColumn.dataset.imgIndex];
                        document.getElementById("NFTdesc").innerHTML = nft.description
                        modal.style.display = "block"
                    }
                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }
                };
                //append the rows to the main container.
                document.getElementById("all-nfts").appendChild(tableRow);
            })
            // if there is an error, display it to the spot where the NFTs would go.
            .catch(error => {
                console.log(error)
                reject(error);
                document.getElementById("all-nfts").innerHTML = "Sorry, that is not a valid address. Try again."
            });
    })
}
module.exports = nftsFromAddress