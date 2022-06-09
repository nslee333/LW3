import axios from "axios";

export async function subgraphQuery(query) {
    try {
        
        const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/nslee333/learn-web3"; // Assigning the subgraph url to a variable for use.

        const response = await axios.post(SUBGRAPH_URL, { // Passing in the url, then passing in the query that we made in queries/index.js file. 
            query,
        });

        if (response.data.errors) { // If there are errors, then log them.
            console.error(response.data.errors);
            throw new Error(`Error making subgraph query: ${response.data.errors}`);
        }

        return response.data.data; // Return the data returned from the Graph.

    } catch (error) { // Catch any errors.
        console.error(err)
        throw new Error(`Could not query the subgraph ${error.message}`);
    }
}

// How this will work is that, when index.js calls this function, it will pass in the query that we made with GraphQL - and pass it in as an argument, then it will return
// The data back to the function that called it - in this case, it would be the function in the pages/index.js file.