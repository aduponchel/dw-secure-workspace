/**
 * IMPORTANT NOTICE: All functions have to be synchronous as dw.js module.exports have be synchronous too.
 */

const fs = require('node:fs');
const path = require('node:path');
const {homedir} = require('node:os');
const { publicEncrypt, privateDecrypt } = require('node:crypto');

const sshpk = require('sshpk');

const DEFAULT_SSH_WALLET_LOCATION = path.resolve(homedir(), '.ssh');
const DEFAULT_SSH_PUBLIC_KEY_LOCATION = path.resolve(DEFAULT_SSH_WALLET_LOCATION, 'id_rsa.pub');
const DEFAULT_SSH_PRIVATE_KEY_LOCATION = path.resolve(DEFAULT_SSH_WALLET_LOCATION, 'id_rsa');

const DEFAULT_SECRET_LOCATION = path.resolve(__dirname, '.dwsecret');

function getPublicKey(path) {
    path = path || DEFAULT_SSH_PUBLIC_KEY_LOCATION;
    try {
        return sshpk.parseKey(fs.readFileSync(path, 'utf8'), 'ssh').toBuffer('pkcs8').toString('utf8');
    } catch (error) {
        throw new Error(`Unable to read public key at ${path} : ${error.message}`);
    }
}


function getPrivateKey(path) {
    path = path || DEFAULT_SSH_PRIVATE_KEY_LOCATION;
    try {
        return sshpk.parsePrivateKey(fs.readFileSync(path, 'utf8'), 'ssh').toBuffer('pkcs8').toString('utf8');
    } catch (error) {
        throw new Error(`Unable to read private key at ${path} : ${error.message}`);
    }
}

function getSecret({path}={path : DEFAULT_SECRET_LOCATION}) {
    return fs.readFileSync(path);
}

function setSecret(secret, {path}={path : DEFAULT_SECRET_LOCATION}) {
    return fs.writeFileSync(path, secret);
}

function encrypt(secret, {publicKey}={}) {
    return publicEncrypt(publicKey || getPublicKey(), Buffer.from(secret, 'utf8'));
}

function decrypt({privateKey, secret}={}) {
    return privateDecrypt(privateKey || getPrivateKey(), secret || getSecret()).toString('utf8');
}

module.exports = {
    DEFAULT_SSH_WALLET_LOCATION,
    DEFAULT_SSH_PUBLIC_KEY_LOCATION,
    DEFAULT_SSH_PRIVATE_KEY_LOCATION,
    DEFAULT_SECRET_LOCATION,
    getPublicKey,
    getPrivateKey,
    getSecret,
    setSecret,
    encrypt,
    decrypt,
}