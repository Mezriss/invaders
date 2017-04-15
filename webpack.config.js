function buildConfig(env) {
	return require('./buildConf/' + env + '.js')
}

module.exports = buildConfig;
