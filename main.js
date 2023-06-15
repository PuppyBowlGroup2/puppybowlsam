// This code imports functions and modules from './players.js' and initializes the application by fetching all players, rendering them, and displaying a form for adding new players.

// Importing necessary functions and modules from './players.js'
import { 
   fetchAllPlayers,
   fetchSinglePlayer,
   renderPlayerDetails,
   addNewPlayer,
   removePlayer,
   renderAllPlayers,
   renderNewPlayerForm } from './players.js';

// Initializing the application
const init = async () => {
// Fetching all players asynchronously
const players = await fetchAllPlayers();
// Rendering all players
renderAllPlayers(players);
// Rendering the form for adding a new player
renderNewPlayerForm();
};
// Calling the initialization function
init();