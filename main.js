import { 
  fetchAllPlayers,
  fetchSinglePlayer,
  renderPlayerDetails,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderNewPlayerForm } from './players.js';

const init = async () => {
const players = await fetchAllPlayers();
renderAllPlayers(players);
renderNewPlayerForm();
};

init();