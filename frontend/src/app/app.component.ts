import { Component } from '@angular/core';
import * as nearAPI from "near-api-js";
import { getConfig } from "../../config.js"
import { stringifyJsonOrBytes } from "near-api-js/lib/transaction";

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'skn-neer-challenge-hallo';
	values = '';

	onKey(event: any) {
		this.values = event.target.value;
	}

	async startContract() {
		const { keyStores } = nearAPI;
		const keyStore = new keyStores.BrowserLocalStorageKeyStore();
		const { connect } = nearAPI;

		const config = {
			networkId: "testnet",
			keyStore,
			nodeUrl: "https://rpc.testnet.near.org",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org",
		};
		const near = await connect(config);

		contract.hello(
			{ name: name_prompt.value },
			BOATLOAD_OF_GAS,
			0
		).then((answer) => {
			fieldset.disabled = false;
			name_prompt.value = '';
			name_prompt.focus();
			setAnswer(answer);
		});
	}


// Initializing contract
async function initContract() {
	const nearConfig = getConfig('testnet');
	const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
	const near = await nearAPI.connect({ keyStore, ...nearConfig });
	const walletConnection = new nearAPI.WalletConnection(near);

	// Load in user's account data
	let currentUser;
	if (walletConnection.getAccountId()) {
		currentUser = {
			// Gets the accountId as a string
			accountId: walletConnection.getAccountId(),
			// Gets the user's token balance
			balance: (await walletConnection.account().state()).amount,
		};
	}

	// Initializing our contract APIs by contract name and configuration
	const contract = await new nearAPI.Contract(
		// User's accountId as a string
		walletConnection.account(),
		// accountId of the contract we will be loading
		// NOTE: All contracts on NEAR are deployed to an account and
		// accounts can only have one contract deployed to them.
		nearConfig.contractName,
		{
			// View methods are read-only – they don't modify the state, but usually return some value
			viewMethods: ['get_last_message'],
			// Change methods can modify the state, but you don't receive the returned value when called
			changeMethods: ['hello', 'remember_me'],
			// Sender is the account ID to initialize transactions.
			// getAccountId() will return empty string if user is still unauthorized
			sender: walletConnection.getAccountId(),
		}
	);

	const provider = near.connection.provider;, stringifyJsonOrBytes

	return { contract, currentUser, nearConfig, walletConnection, provider };
}
}
