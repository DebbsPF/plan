const productForm = document.querySelector("#productForm");

// Form
const formCategory= document.querySelector("#formCategory");
const formName = document.querySelector("#formName");
const formDesc = document.querySelector("#formDesc");
const formPrice = document.querySelector("#formPrice");
const formStock = document.querySelector("#formStock");
const confirmation = document.querySelector("#confirmation");

const products = document.querySelector("#displayProduct");

// Displays every product present in PG
function displayProduct(data){

    const div = document.createElement("div");
    const displayName = document.createElement("h2");
    const displayDesc = document.createElement("p");
    const displayCategory = document.createElement("p");
    const displayPrice = document.createElement("p");
    const displayStock = document.createElement("p");
    const delBtn = document.createElement("button");
    const updBtn = document.createElement("button");

    displayName.textContent = `${data.name}`;
    displayDesc.textContent = `Description: ${data.description}`;
    displayCategory.textContent = `Category: ${data.categoryname}`;
    displayPrice.textContent = `Price: ${data.price}`;
    displayStock.textContent = `Stock: ${data.stock}`;
    delBtn.textContent = "DELETE";
    updBtn.textContent = "UPDATE";


    delBtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/products/${data.productid}`, 
            {method: "DELETE"}
        )
        .then(response => {
            if(!response.ok){
                throw new Error("Failed to delete product");
            }

            return response.json();
        })
        .then(data => {
            console.log("Successfully deleted product");
            div.remove();
        })
        .catch(error => {
            console.error(error);
        })
    })

    updBtn.addEventListener("click", () => {
        updBtn.disabled = true;

        const updPrice = document.createElement("input");
        const updStock = document.createElement("input");
        const saveBtn = document.createElement("button");


        updPrice.type = "number";
        updPrice.placeholder = "New price";

        updStock.type = "number";
        updStock.placeholder = "New Stock";

        saveBtn.textContent = "Save";

        div.appendChild(updPrice);
        div.appendChild(updStock);
        div.appendChild(saveBtn);

        saveBtn.addEventListener("click", () => {
            fetch(`http://localhost:3000/products/${data.productid}`,
                {method: "PATCH", 
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        price: updPrice.value,
                        stock: updStock.value
                    })
                }
            )
            .then(response => {
                if(!response.ok){
                    throw new Error("Product has not been updated");
                }
                return response.json();
            })
            .then(data => {
                displayPrice.textContent = `Price: ${data.price}`;
                displayStock.textContent = `Stock: ${data.stock}`;

                updPrice.remove();
                updStock.remove();
                saveBtn.remove();

                updBtn.disabled = false;
            })
            .catch(error => {
                console.error(error);
            })
        })

        
    });


    div.appendChild(displayName);
    div.appendChild(displayDesc);
    div.appendChild(displayCategory);
    div.appendChild(displayPrice);
    div.appendChild(displayStock);
    div.appendChild(updBtn);
    div.appendChild(delBtn);

    products.appendChild(div);
}

fetch("http://localhost:3000/products")
.then(response => {return response.json()})
.then(data => {
    data.forEach(product => {
        displayProduct(product)
    })
});


productForm.addEventListener("submit", (event) => {
    event.preventDefault();

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
    )
    .then(response => {
        if(!response.ok){
            throw new Error("Failed to create product");
        }

        return response.json();
    })
    .then(data => {
        const confirm = document.createElement("p");

        confirm.textContent = "Successfully added product";
        confirmation.appendChild(confirm);

        displayProduct(data);
        
    })
    .catch(error => {
        console.error(error);
    });

    productForm.reset();
})