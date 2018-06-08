
const SRC_FILE_PATH = '../build/bin/compiled.ts';
const DEPLOYED_DATA_FILE_PATH = '../build/bin/deployed.json';

const ACCOUNT_JSON = { "address": "n1SAQy3ix1pZj8MPzNeVqpAmu1nCVqb5w8c", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "40701b061f1f6d3935dc43c2c06c7ed619c3b85f5ad4934fc440e1d61e878333", "cipherparams": { "iv": "5e2ec4e7a241f2a086754df398373605" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 4096, "p": 1, "r": 8, "salt": "af935393fdde22073b99cd23898ba3f681b53272fe662f71d1220736ef517a1b" }, "mac": "be6ba64359a617fbbd55558dd2dd412b1f5205fe1f130186f0155d1645313ee6", "machash": "sha3256" }, "id": "fcadcf90-858c-46f0-88dd-0fa4b5d98f51", "version": 3 };
const PASS_PHRASE = "passphrase";

const NETWORK_PROVIDER =
    {
        mainnet:
            {
                chain_id: 1,
                url: "https://mainnet.nebulas.io"
            },
        testnet:
            {
                chain_id: 1001,
                url: "https://testnet.nebulas.io"
            },
        localnet:
            {
                chain_id: 100,
                url: "http://127.0.0.1:8685"
            }
    };

const PROVIDER = NETWORK_PROVIDER.testnet       // 1: mainnet ; 1001: testnet ; 100 localnet
module.exports = {
    SRC_FILE_PATH: SRC_FILE_PATH,
    DEPLOYED_DATA_FILE_PATH: DEPLOYED_DATA_FILE_PATH,
    DEPLOY_ACCOUNT_JSON: ACCOUNT_JSON,
    DEPLOY_ACCOUNT_PASSPHRASE: PASS_PHRASE,
    PROVIDER: PROVIDER
};
