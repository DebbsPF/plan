const express = require("express"); // express package
const { Pool } = require("pg"); // postgres package
require("dotenv").config(); // to reach the .env file
const cors = require("cors");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const app = express();
const PORT = 3000;

app.use(express.json()); // allows Express to understand JSON sent in the request body
app.use(cors());

// Listening for incoming HTTP requests on PORT 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


// GET /
app.get("/", (req, res) => {
    res.send("Army Store");
});


// CREATE product
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
                    error: "Failed to insert product to Database"
                });
            }else{
                res.status(201).json(result.rows[0]);
            }
        }
    );
});


// READ all products
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
                error: "Database error"
            });
        }else{
            res.json(result.rows);
        }

    });
});


// READ product by ID
app.get("/products/:id", (req, res) => {
    pool.query(
        "SELECT * FROM product WHERE productid = $1",
        [req.params.id],
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Database error"
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
    );
});


// UPDATE product
app.patch("/products/:id", (req, res) => {
    pool.query(
        "UPDATE product SET price = $1, stock = $2 WHERE productid = $3",
        [
            req.body.price,
            req.body.stock,
            req.params.id
        ],
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error on updating specific product"
                });
            }else{
                if(result.rowCount === 0){
                    res.status(404).json({
                        error: "Product not found"
                    });
                }else{
                    res.status(200).json({
                        message: "Successfully updated a product"
                    });
                }
            }
        }
    );
});


// DELETE product
app.delete("/products/:id", (req, res) => {
    pool.query(
        "DELETE FROM product WHERE productid = $1",
        [req.params.id],
        (error, result) => {
            if(error){
                console.error(error);
                res.status(500).json({
                    error: "Error on deleting a specific product"
                });
            }else{
                if(result.rowCount === 0){
                    res.status(404).json({
                        error: "Product not found"
                    });
                }else{
                    res.status(200).json({
                        message: "Successfully deleted a product"
                    });
                }
            }
        }
    );
});