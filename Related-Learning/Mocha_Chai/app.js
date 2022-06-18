
// This is the file that we're going to test.


var Chef = function() {
    this.dishes = ['Dosa', 'Tea', 'Pokoras', 'Pav Bhaji'];
    this.customers = 5;
};

Chef.prototype.checkMenu = function() {


    // let dish = 3; This line will fail the test.

    let dish = this.dishes[Math.floor(Math.random() * this.dishes.length)]; 
    
    // Math.random() is used to select a random number, when you multiply it times the max, it will select a number between 0 and the max number.

    // math.floor makes sure it returns the largest integer less than, or equal to a given number.
    // In this case it's wrapped around a the random number generated.

    // In this case, we're grabbing a random dish (number between 0 and the max dishes) and making sure that it returns an integer (No decimal places, because
    // We want to grab a whole number, one that will return a value on the  dishes array.), and then returning it to the function that called it.

    console.log("I would like to have:", dish);

    return dish;
}

Chef.prototype.customersFed = function() {


    // In this function, we have a certain amount of customers in our Chef function - this chef can make x dishes and has 5 customers.

    // In this customersFed() function, we have a conditional that outputs different logs depending upon how many customers are left.


    if(this.customers >= 1) { // if for logging the last customer

        console.log("Customer fed with Yummy Food :)");
        this.customers--;

    } else if(this.customers == 0){ // If there are no more customers, console.log this message.

        console.log("All the customers have been satisfied, done for the day!");

    } else { // This logs all the customers that are left.

        let custLeft = this.customers;

        console.log("Customer fed with Yummy Food", custLeft, "More to go!");
        this.customers -= custLeft;
    }
    
    return this.customers;
}




let chef = new Chef(); // Let a 'chef' equal a new instance of the Chef object?

module.exports = chef;