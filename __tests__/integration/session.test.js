const request = require('supertest')

const app = require('../../src/app')

// const { User } = require('../../src/app/models')

const truncate = require('../utils/truncate')

const factory = require('../factories')

describe('Authentication', () => {
	beforeEach(async () => {
		await truncate()
	})
	
	it('should create a user', async () => {
		const user = await factory.create('User', {
			password: '123123'
		})

		expect(user.email).toBe(user.email)
	})

	it('should authenticate with valid credentials', async () => {
		const user = await factory.create('User')
		
		const res = await request(app)
			.post('/session')
			.send({
				email: user.email,
				password: user.password
			})

		expect(res.status).toBe(200)
	})

	it('should not authenticate with invalid credentials', async () => {
		const user = await factory.create('User')
		
		const res = await request(app)
			.post('/session')
			.send({
				email: user.email,
				password: '123'
			})

		expect(res.status).toBe(401)	
	})

	it('should return jwt token when authenticated', async () => {
		const user = await factory.create('User')
		
		const res = await request(app)
			.post('/session')
			.send({
				email: user.email,
				password: user.password
			})

		expect(res.body).toHaveProperty("token")
	})

	it('should be able to access private routes when authenticated', async () => {
		const user = await factory.create('User')
		
		const res = await request(app)
			.get('/dashboard')
			.set('Authorization', `Bearer ${user.generateToken()}`)

		expect(res.status).toBe(200)
	})

	it('should not be able to access private routes without jwt token', async () => {
		const res = await request(app)
			.get('/dashboard')	

		expect(res.status).toBe(401)
	})

	it('should not be able to access private routes with invalid jwt token', async () => {
		const res = await request(app)
			.get('/dashboard')
			.set('Authorization', `Bearer 123321`)

		expect(res.status).toBe(401)
	})
})