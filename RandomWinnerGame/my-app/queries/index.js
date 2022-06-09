export function FETCH_CREATED_GAME() {
    return `query {
        games(orderBy:id, orderDirection:desc, first:1){ 
            id
            maxPlayers
            entryFee
            winner
            players
        }
    }`;
}

// return a GraphQL query - 
    // Where we want a Game object, and we want a 'game' object where data is ordered by ID, which is the gameId, in descending order, and we want the first game from this ordered data.
    // Then get query these properties of the game object.

    // Descending order means that the latest will be first - of 4 games played, - the 4th game will be displayed first.

    