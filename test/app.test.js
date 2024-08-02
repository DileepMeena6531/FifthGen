const request = require('supertest');
const { app, server } = require('../app');

describe('Device Communication', () => {
    afterAll((done) => {
        server.close(done); 
    });

    it('should read data from device', async () => {
        const response = await request(app)
            .post('/devices/read')
            .send({
                ip: '127.0.0.1',
                port: 8080,
                message: 'rahul kumar'
            })
            .expect('Content-Type', /json/) 
            .expect(200); 

        expect(response.body).toHaveProperty('response');
    });
});
