const productForm = document.querySelector("#productForm");

const formCategory= document.querySelector("#formCategory");
const formName = document.querySelector("#formName");
const formDesc = document.querySelector("#formDesc");
const formPrice = document.querySelector("#formPrice");
const formStock = document.querySelector("#formStock");
const confirmation = document.querySelector("#confirmation");

const productContainer = document.querySelector("#productContainer");

function displayProduct(data){

    const div = document.createElement("div");
    const displayName = document.createElement("h2");
    const displayDesc = document.createElement("p");
    const displayCategory = document.createElement("p");
    const displayPrice = document.createElement("p");
    const displayStock = document.createElement("p");

    
    displayName.textContent = `${data.name}`;
    displayDesc.textContent = `Description: ${data.description}`;
    displayCategory.textContent = `Category: ${data.categoryname}`;
    displayPrice.textContent = `Price: ${data.price}`;
    displayStock.textContent = `Stock: ${data.stock}`;


    div.appendChild(displayName);
    div.appendChild(displayDesc);
    div.appendChild(displayCategory);
    div.appendChild(displayPrice);
    div.appendChild(displayStock);

    productContainer.appendChild(div);
}

fetch("http://localhost:3000/products")
.then(response => {return response.json()})
.then(data => {
    data.forEach(product => {
        displayProduct(product);
    })
})

productForm.addEventListener("submit", (event) => {
    
    event.preventDefault(); // prevents from restarting the website

    fetch("http://localhost:3000/products",
        {method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                categoryid: formCategory.value,
                adminid: 1, // Set as default for now
                name: formName.value,
                description: formDesc.value,
                price: formPrice.value,
                stock: formStock.value
            })
        }
    ).then(response => {return response.json()})
    .then(data => {
        displayProduct(data);

        const confirm = document.createElement("p");

        confirm.textContent = "Successfully Uploaded a New Product";

        confirmation.appendChild(confirm);
        productForm.reset();
    })

})
