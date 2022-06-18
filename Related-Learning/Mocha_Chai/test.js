const assert = require('chai').assert; // Importing in the chai assert library.
const Chef = require('./app'); // Importing in the code to be tested.

describe('Chef test', function () {  

    // describe method takes in two arguments, a label describing what the test is about, and a function that does all the testing.
    
    // 'it' method takes in two arguments, the label and the function just like above, the function uses the assert module's methods. 

    let chef = Chef; // Creating an instance of the code to be tested.

    // This first test is checking that the chef.checkMenu function is returning a string.

    it.skip('check the dish has a valid name.', function () { 
        assert.isString(chef.checkMenu(), 'string'); // This line specifically checks that the value returned by the checkMenu function is a string.
        // assert.isString() is a Chai method that checks that the value returned by the checkMenu function returns a string.
    })



    // it takes in two arguments, the label and the function just like above, the function performs the testing.

    // This second test is used for checking that a random value grabbed from our application exists in our menu.
    it.skip('check for a dish in menu.', function () {
        let dish = chef.checkMenu() // Grabbing a random menu item value, and assigning it to a variable. 
        assert.oneOf(dish, chef.dishes) // Assert that the 'dish' value exists in the chef.dishes array.
    });



    // In this test, we loop through the customersFed() function, and test what happens when the customer count reaches zero.


    it('Make sure that the chef can feed more', function () {

        for ( var i = 0; i < 6; i++ ) { // We loop through the customersFed() function 5 times (for each customer), and we check to see th
            chef.customersFed();
            assert.isAtLeast(chef.customers, 0); // We assert that the value of 'chef.customers' is at least 0 for each loop through.
            // Once we get to the end of the 5 loops - and it is still at least 0, then it returns that the test has passed.
        }

    });

    // Another thing to note, is that if we want to skip a test, at the beginning of the test, we can put 'it.skip(...)' at the beginning of the file
    // And Mocha/Chai will skip over that test until .skip is removed. 

    // In the console when a test is skipped, it will throw a 'pending' status.

});