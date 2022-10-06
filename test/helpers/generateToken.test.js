
const jwt=require('../../helpers/generateToken')
const { server} = require('../../server');


beforeEach(async () => {
    server.close();
});

test('Devolver el token',async() => {
    const payload={
        id: 1,
        username: 'diegogod',
        role: 'GOD',
    }
    const token = await jwt(payload)
    expect(typeof token).toBe('string');
  });
  

  test('Forzar error en token sin payload', () => {
   expect(async() => await jwt()).rejects.toEqual('No se pudo crear el token')
  });