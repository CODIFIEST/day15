// import the function that shows us the NFTs when an address is given
import nftsFromAddress from "./utils";
// import clearScreen from "./utils";

//add an event listener using a const so we can reuse it.
const submitButton = document.getElementById("submit-button");

//click the button and get whatever is inside the text box id address-input
submitButton.addEventListener("click", function () {
    //this gets the NFTs from the address submitted
    nftsFromAddress();
});