const { sequelize }  = require('../../src/app/models')

module.exports = () => {
	return Promise.all(Object.keys(sequelize.models).map(k => {
		return sequelize.models[k].destroy({ truncate: true, force: true })
	}))
}