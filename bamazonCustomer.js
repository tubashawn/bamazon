var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

function productInfo() {
    connection.query("SELECT * FROM products",
        function (err, results) {
            if (err) throw err;

            inquirer.prompt([{
                type: "list",
                name: "promptChoice",
                message: "Which of the following would you like to buy?",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                }
            }]).then(function (answer) {
                var chosenItem = answer.promptChoice;

                inquirer.prompt([{
                    type: "confirm",
                    name: "confirmChoice",
                    message: "You chose " + chosenItem + ". Is that correct?",
                }]).then(function (confirm) {
                    if (!confirm.confirmChoice) {
                        console.log("Let's try this again.");
                        productInfo();
                    } else {
                        figureQuantity(chosenItem);
                    }
                });
            });
        });
}

function figureQuantity(chosenItem) {

    // var availableQuantity = "SELECT stock_quantity FROM products WHERE ?";
    // connection.query(availableQuantity, function(err, res) {
    // 
    // });
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "What quantity would you like?"
    }]).then(function (quantity) {
        // availableQuantity based off database quantity
        var userQuantity = quantity.quantity;
        if (userQuantity > availableQuantity) {
            console.log("Sorry, we only have " + availableQuantity + " in stock, please select a smaller quantity");
            figureQuantity();
        } else {
            connection.query("SELECT * FROM products where product_name = " + chosenItem, function (err, results) {
                if (err) throw err;
                else{
                    console.log(results);
                }
            });
            // availableQuantity = availableQuantity - userQuantity; update database
            // var price = 
            // var purchasePrice = userQuantity * price;
            // console.log("The total cost for your " + chosenItem + " is " + purchasePrice);


        }
    });
}

productInfo();