const readline = require('node:readline');
const { createInterface } = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const { DEFAULT_SSH_PUBLIC_KEY_LOCATION, getPublicKey, encrypt, setSecret } = require('./index.js');

(async function () {
    const rl = createInterface({ input, output });

    async function questionSecret(question) {
        const onDataHandler = (charBuff) => {
            const char = charBuff + '';
            switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    input.removeListener('data', onDataHandler);
                    break;
                default:
                    output.clearLine(0);
                    readline.cursorTo(output, 0);
                    output.write(question);
                    break;
            }
        };
        input.on('data', onDataHandler);
        const secret = await rl.question(question);
        rl.history = rl.history.slice(1);
        return secret;
    }

    try {
        const publicKey = getPublicKey(await rl.question(`ssh public key location (${DEFAULT_SSH_PUBLIC_KEY_LOCATION}): `));
        const password = await questionSecret('Password: ');
        setSecret(encrypt(password, { publicKey }));
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        rl.close();
    }
})();