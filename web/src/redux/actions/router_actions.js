
const navigate = (url) => ({
  type: 'SET_ROUTE',
  payload: url,
});

const newRetro = () => navigate('/retros/new');
const showRetro = (retro) => navigate(`/retros/${retro.slug}/`);
const home = () => navigate('/');


export {home, newRetro, showRetro};
