// Import Solana web3.js library
const solanaWeb3 = require('@solana/web3.js');

// Define the Solana cluster (mainnet-beta, testnet, or devnet)
const cluster = 'https://api.mainnet-beta.solana.com'; // can replace your private rpc from infura or alchemy

// Create a connection to the Solana cluster
const connection = new solanaWeb3.Connection(cluster, 'confirmed');

// Define the addresses to monitor
const monitoredAddresses = [
  'CvtBkCAb7YxjwnEJCYLSjq4yaBEujYhtvhpdvizFJQzi',
  '8zBebffUf8SLJW22FbJ1VUewrEAUe2mG919tR6HKW1Sy',
  // Add more addresses as needed
];

// Function to handle transaction messages
async function handleTransaction(transactionSignature) {
  try {
    // Fetch transaction details
    const transaction = await connection.getTransaction(transactionSignature, { commitment: 'confirmed' });
    if (transaction) {
      console.log('Transaction details:', JSON.stringify(transaction, null, 2));
    } else {
      console.log('Transaction not found:', transactionSignature);
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
}

// Subscribe to account changes
monitoredAddresses.forEach((address) => {
  const publicKey = new solanaWeb3.PublicKey(address);

  // Subscribe to account change notifications
  connection.onAccountChange(publicKey, (accountInfo) => {
    console.log(`Account changed: ${address}`);
    console.log('Account info:', JSON.stringify(accountInfo, null, 2));
  });

  // Subscribe to signature notifications
  connection.onSignature(publicKey, (signature, result) => {
    console.log(`Signature detected: ${signature}`);
    handleTransaction(signature);
  });
});

console.log('Monitoring addresses:', monitoredAddresses.join(', '));
