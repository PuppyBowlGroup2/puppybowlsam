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
            <div class="button-container">
            <button class="details-button" data-id="${player.id}">See Details</button>
           
            <button class="Remove-button" data-id="${player.id}">Remove From Roster</button>
          </div>
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
        //createdAt and updatedAt should be created by the app, not the user. exclude them from the form
        let form = `
        <form>
            <label>Name: </label><input type="text" name="name" placeholder="" required><br><br>
            <label>ID: </label><input type="number" name="id" placeholder="" required><br><br>
            <label>Breed: </label><input type="text" name="breed" placeholder="" required><br><br>
            <label>Status: </label><select name="status">
                <option value="bench">Bench</option>
                <option value="field">Field</option>
            </select><br><br>
            <label>ImageUrl: </label><input type="url" name="imageUrl" placeholder="" required><br><br>
            <label>TeamId: </label><input type="number" name="teamId" placeholder="" required><br><br>
            <label>CohortId: </label><input type="number" name="cohortId" placeholder="" required><br><br>
            <input type="submit" value="Add new Player">
        </form>
        `
        newPlayerFormContainer.innerHTML = form;

        //for submit events add the eventlistener to the entire form
        newPlayerFormContainer.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementsByName('name')[0].value;
            const id = document.getElementsByName('id')[0].value;
            const breed = document.getElementsByName('breed')[0].value;
            const status = document.getElementsByName('status')[0].value;
            const imageUrl = document.getElementsByName('imageUrl')[0].value;

            //createdAt and updateAt should be created by the app
            const createdAt = new Date().getTime();

            //updatedAt should be the same as createdAt when adding a new player. Change updatedAt if the player is edited and saved
            const updatedAt = createdAt;

            const teamId = document.getElementsByName('teamId')[0].value;
            const cohortId = document.getElementsByName('cohortId')[0].value;

            const newPlayer = {
                id,
                name,
                breed,
                status,
                imageUrl,
                createdAt,
                updatedAt,
                teamId,
                cohortId
            }

            await addNewPlayer(newPlayer);
            console.log(newPlayer);
            await window.location.reload();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    //console.log(players);
    //console.log(typeof(players));
    //console.log(Array.isArray(players));
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();

