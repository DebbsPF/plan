// To get the value for every element or object
const productForm = document.querySelector("#productForm");
const productCategory = document.querySelector("#category");
const productName = document.querySelector("#pname");
const productDescription = document.querySelector("#desc");
const productPrice = document.querySelector("#price");
const productStock= document.querySelector("#stock");

const displayProduct = document.querySelector("#display"); // will append to the html

fetch("http://localhost:3000/products")
.then(response => {return response.json()})
.then(data => {console.log(data)});

// This form will create a new product
productForm.addEventListener("submit", () => {
    
    event.preventDefault();

    // Fetching hosts and using the method POST
    fetch("http://localhost:3000/products", 
        {method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                categoryid: productCategory.value,
                adminid: 1, // set as 1 since for practice pani
                name: productName.value,
                description: productDescription.value,
                price: productPrice.value,
                stock: productStock.value
            })
        })
    .then(response => {return response.json()})
    .then(data => { // Displays the newly created product
        const p = document.createElement("p");

        p.textContent = 
        `${productCategory.value}, ${productName.value},
         ${productDescription.value}, ${productPrice.value}, ${productStock.value}`
        
        displayProduct.appendChild(p);
    });
})