const {Assets, Foreman, Lint, Jasmine} = require('pui-react-tools');

Assets.install({
  assets: {
    sass: false,
    html: false
  },
  useAssetsServer: false
});
Foreman.install();
Lint.install();
var seed = (Math.random() * 1000000)|0;
Jasmine.install({
	browserServerOptions: {port: 8888},
	headlessServerOptions: {seed: seed}
});

console.log("Random seed used:", seed);
