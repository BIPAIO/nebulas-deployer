const sleep = require('util').promisify(setTimeout)

let fs = require('fs');

let Nebulas = require('nebulas');
let neb = new Nebulas.Neb();

const {SRC_FILE_PATH, DEPLOYED_DATA_FILE_PATH, DEPLOY_ACCOUNT_JSON, DEPLOY_ACCOUNT_PASSPHRASE, PROVIDER} = require('./config');

let src = fs.readFileSync(SRC_FILE_PATH, 'utf8');
let deployed_data = { mainnet: [], testnet: [], localnet: [] };

let deployer_account = null;

function init() {
    loadDeployedData();

    neb.setRequest(new Nebulas.HttpRequest(PROVIDER.url));

    deployer_account = Nebulas.Account.fromAddress(DEPLOY_ACCOUNT_JSON.address);
    deployer_account.fromKey(DEPLOY_ACCOUNT_JSON, DEPLOY_ACCOUNT_PASSPHRASE);
    deployer_account.getAddressString();
}

function loadDeployedData() {
    try {
        fs.accessSync(DEPLOYED_DATA_FILE_PATH);
        deployed_data = JSON.parse(fs.readFileSync(DEPLOYED_DATA_FILE_PATH, 'utf8'));
    } catch (e) {
        console.error(e.message);
    }

}


async function getAccountNonce(address) {
    let state = await neb.api.getAccountState(address);
    return state.nonce;
}

async function verifyContract(address, src, args, type) {
    let nonce = await getAccountNonce(address);

    let params = {
        "from": address,
        "to": address,
        "value": 0,
        "nonce": ++nonce,
        "gasPrice": 1000000,
        "gasLimit": 2000000,
        "contract": {
            "source": src,
            "sourceType": type || "ts",
            "args": JSON.stringify(args)
        }
    };

    try {
        return await neb.api.call(params);
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function deploy(address, src, args, type) {
    if (!verifyContract(address, src, args, type)) {
        console.log("verification of contract source code falled!");
        return false;
    }
    let nonce = await getAccountNonce(address);

    let params = {
        from: address,
        to: address,
        value: 0,
        nonce: ++nonce,
        gasPrice: 10000000,
        gasLimit: 50000000,
        contract: {
            source: src,
            sourceType: type || "ts",
            args: JSON.stringify(args)
        }
    };

    let gTx = new Nebulas.Transaction(PROVIDER.chain_id,
        deployer_account,
        params.to, params.value, params.nonce, params.gasPrice, params.gasLimit, params.contract);
    gTx.signTransaction();

    let result = await neb.api.sendRawTransaction(gTx.toProtoString());
    console.log("deploy contract: ", result);
    return result;
}

async function checkingTransactionReceipt(txhash) {
    try {
        let nu = 0;
        while (1) {
            let result = await neb.api.getTransactionReceipt(txhash);
            console.log(nu++);
            if (result.status === 2) {
                await sleep(5000);
            } else {
                if (result.status === 1) {
                    console.log("transaction done!");
                    return txhash;
                } else {
                    console.log("transaction receipt: " + JSON.stringify(result));
                    return false;
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

async function deployContract() {
    console.log(">>> start to deploy contract to chain: ", PROVIDER.chain_id);
    let result = await deploy(deployer_account.getAddressString(), src, [], "ts");
    let txhash = await checkingTransactionReceipt(result.txhash);
    if (txhash) {
        if (PROVIDER.chain_id === 1) {
            deployed_data.mainnet.push({ txhash: txhash, address: result.contract_address });
        } else if (PROVIDER.chain_id === 1001) {
            deployed_data.testnet.push({ txhash: txhash, address: result.contract_address });
        } else if (PROVIDER.chain_id === 100) {
            deployed_data.localnet.push({ txhash: txhash, address: result.contract_address });
        }
        fs.writeFileSync(DEPLOYED_DATA_FILE_PATH, JSON.stringify(deployed_data));
    }
}

init();
deployContract();
