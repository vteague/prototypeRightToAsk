const generateCode = require('../generateCode');
const genCode = require('../generateCode');

describe('testing generateCode', () => {
	
	test('generating a 6 digit verification code', async () => {
        var result = genCode();
        expect(result >= 100000).toBe(true);
        expect(result <= 999999).toBe(true);
    });

    test('subsequent codes are different', async () => {
        var result1 = genCode();
        var result2 = genCode();
        var result3 = genCode();
        var result4 = genCode();

        expect(result1).not.toEqual(result2);
        expect(result1).not.toEqual(result3);
        expect(result1).not.toEqual(result4);
    });
});