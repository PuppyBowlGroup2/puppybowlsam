const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-PT-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;


/**
 * It fetches all players from the API and returns the
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
    const response = await fetch(`${APIURL}/players`);
    // console.log(response);
    const players = await response.json();
    return players;
  } catch (error) {
    console.log(error, 'Uh oh, trouble fetching players!');
    }
};

// fetches Single Player

const fetchSinglePlayer = async (playerId) => {
  try {
      const response = await fetch(`${APIURL}/players${playerId}`);
      // console.log(response);
      const playerData = await response.json();
      return playerData;
  } catch (error) {
      console.log(error, 'Oh no, trouble fetching player');
  }
};


const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players${playerObj}`);
        // console.log(response);
        const playerObject = await response.json();
        return playerObject;
    } catch (error) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
//     fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2302-ACC-PT-WEB-PT-A/players/${playerId}/`, {
//     method: 'DELETE',
//   });
console.log('deleting ' + playerId);
try {

const requestOptions = {
          method: 'DELETE'
        };
        const response = await fetch(`${APIURL}/players${playerId}`, requestOptions);
        const player = await response.json();
        return player;
    } catch (error) {
        console.log (error, `Whoops, trouble removing player #${playerId} from the roster!`,
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = '',
        playerList.forEach((player) => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.innerHTML = `
          <h2>${player.name}</h2>
          <p>${player.description}</p>
          <p>${player.breed}</p>
          <button class="details-button" data-id="${player.id}">See Details</button>
          <button class="delete-button" data-id="${player.id}">Delete</button>
          `;
          playerContainer.appendChild(playerElement);
        
    // See Details
    const detailsButton = playerElement.querySelector('.details-button');
    detailsButton.addEventListener('click', async (event) => {

      const playerId = event.target.dataset.id
      fetchSinglePlayer(playerId);
    });

    //delete player
const deleteButton = playerElement.querySelector('delete-button');
deleteButton.addEventListener('click', async (event) => {

  const playerId = event.target.dataset.id
  removePlayer(playerId);
  event.target.closest('div.player').remove()
  });
  });
} catch (error) {
  console.error(error)
}
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = async () => {
        const [puppy, breed] = await Promise.all([
            fetch(cohortName).then(response => response.json())
        ])
      }


 const init = async () => {
    const players = await fetchAllPlayers()
    renderAllPlayers(players)
};

init();