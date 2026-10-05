import express from "express"; // Import express package
import { Pool } from "pg"; // Import postgres package
import "dotenv/config"; // Import dotenv
import cors from "cors"; // Import cors to access the server.js

// Communicate with PG
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const app = express(); // Express application
const PORT = 3000; // standard Local Port

app.use(express.json());  // allows Express to understand JSON sent in the request body
app.use(cors()); // allows to access the server

// Listening for incoming HTTP requests on PORT 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


// CREATE

// Route to create a product
app.post("/products", (req, res) => {

    pool.query(
        `INSERT INTO product 
        (categoryid, adminid, name, description, price, stock)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`, 
        [
            req.body.categoryid,
            req.body.adminid,
            req.body.name,
            req.body.description,
            req.body.price,
            req.body.stock
        ], 
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error posting product"
                });
            }else{
                res.status(201).json(result.rows[0]);
            }
        }
    )

})

// READ
// Route for the "Main Page or /"
app.get("/", (req, res) => {
    res.send("Main Route");
});

// Route for products
app.get("/products", (req, res) => {
    pool.query(`
        SELECT 
            product.productid,
            product.name,
            product.description,
            product.price,
            product.stock,
            category.name AS categoryname
        FROM product
        JOIN category
            ON product.categoryid = category.categoryid
        `, (error, result) => {
        if(error){
            console.error(error);
            res.status(500).json({
                error: "Error on retrieving data"
            });
        }else{
            res.json(result.rows);
        }
    })
})

// Route for specific product
app.get("/products/:id", (req, res) => {
    pool.query(
        `SELECT * FROM product WHERE productid = $1`,
        [req.params.id],
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error on retrieving data"
                });
            }else{
                if(result.rowCount === 0){
                    res.status(404).json({
                        error: "Product not found"
                    });
                }else{
                    res.json(result.rows[0]);
                }
            }
        }
    )
})

//UPDATE 
// Route for products and its product to Update
app.patch("/products/:id", (req, res) => {
    
    pool.query(
        `UPDATE product SET price = $1, stock = $2 WHERE productid = $3 RETURNING *`, 
        [
            req.body.price,
            req.body.stock,
            req.params.id
        ], 
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error on backend"
                });
            }else{
                if(result.rowCount === 0){
                    res.status(404).json({
                        error: "Product not found"
                    });
                }else{
                    res.status(200).json(result.rows[0]);
                }
            }
        }
    );

})

// DELETE
// Delete the product
app.delete("/products/:id", (req, res) => {

    pool.query("DELETE FROM product WHERE productid = $1", 
        [req.params.id],
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error on backend"
                });
            }else{
                if(result.rowCount === 0){
                    res.status(404).json({
                        error: "Product not found"
                    });
                }else{
                    res.json({message: "Product deleted"});
                }
            }
        }
    );

})

