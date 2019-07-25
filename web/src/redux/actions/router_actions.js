
const navigate = (url) => ({
  type: 'SET_ROUTE',
  payload: url,
});

const home = () => navigate('/');
const newRetro = () => navigate('/retros/new');
const showRetro = (retro) => navigate(`/retros/${retro.slug}`);
const showRetroForId = (retro_id) => navigate(`/retros/${retro_id}`);
const retroLogin = (retro_id) => navigate(`/retros/${retro_id}/login`);
const retroRelogin = (retro_id) => navigate(`/retros/${retro_id}/relogin`);
const retroArchives = (retroId) => navigate(`/retros/${retroId}/archives`);
const retroArchive = (retroId, archiveId) => navigate(`/retros/${retroId}/archives/${archiveId}`);
const retroSettings = (retroId) => navigate(`/retros/${retroId}/settings`);
const retroPasswordSettings = (retroId) => navigate(`/retros/${retroId}/settings/password`);
const registration = (accessToken, email, name) => navigate(`/registration/${accessToken}/${email}/${name}`);

export {
  home,
  newRetro,
  showRetro,
  retroLogin,
  retroRelogin,
  showRetroForId,
  retroArchives,
  retroArchive,
  retroSettings,
  retroPasswordSettings,
  registration,
};
