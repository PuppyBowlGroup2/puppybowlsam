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
        const response = await fetch(APIURL);
        const data = await response.json();
        const players = data.data.players;
        // console.log(players)
        return players;
    } catch (error) {
        console.error('Uh oh, trouble fetching players!', error);
        throw error;
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const data = await response.json();
        const player = data.data.player
        return player;
    } catch (error) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/${playerObj}`);
        // console.log(response);
        const playerObj = await response.json();
        return playerObj;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            console.log("player removed")
        } else {
            console.error("Player invincible")
        }
    } catch (error) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, error);
    }
};

const renderAllPlayers = async (players) => {
    try {
        playerContainer.innerHTML = '';
        players.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
            <h2>${player.name}</h2>
            <p>${player.breed}</p>
            <p>${player.status}</p>
            <img src=${player.imageUrl}/>
            <button class="details-button" data-id="${player.id}">See Details</button>
            <button class="Add-button" data-id="${player.id}">Add Player</button>
            <button class="Remove-button" data-id="${player.id}">Remove From Roster</button>
            `;
            playerContainer.appendChild(playerElement);

            // details button
            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) =>{
                let playerId = event.currentTarget.dataset.id;
                await RenderPlayerById(playerId)
            });
            //remove button 
            const RemoveButton = playerElement.querySelector('.Remove-button');
            RemoveButton.addEventListener('click', async (event) => {
            const playerId = event.target.dataset.id
            await removePlayer(playerId);
            const players = await fetchAllPlayers();
            await renderAllPlayers(players);
            });
        });
    } catch (error) {
        console.error('Uh oh, trouble rendering players!', error);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (error) {
        console.error('Uh oh, trouble rendering the new player form!', error);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
   // renderNewPlayerForm();
}

init();


