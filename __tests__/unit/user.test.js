const bcrypt = require('bcryptjs')

const { User } = require('../../src/app/models')

const truncate = require('../utils/truncate')

describe('User', () => {
	beforeEach(async () => {
		await truncate()
	})

	it('should encrypt user password', async () => {
		const user = await User.create({name: 'Vitor', email: 'vitor.cruz@fatec.sp.gov.br', password: '123321'})

		const compHash = await bcrypt.compare('123321', user.password_hash)

		expect(compHash).toBe(true)
	})
})