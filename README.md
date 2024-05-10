# Tutorial
`https://lorisleiva.com/create-a-solana-dapp-from-scratch/getting-started-with-solana-and-anchor`

# Compiles your program.`
`anchor build`

# Deploys your compiled program.
`anchor deploy`

# Run local ledger
`solana-test-validator`

# Runs a new EMPTY local ledger.
`solana-test-validator --reset`

# Test app with EMPTY local ledger
`anchor test`

# Get program ID
`solana address -k target/deploy/<your-project-name>-keypair.json`

# Run tests from the `Anchor.toml` file (does not empty the local ledger)
`anchor run test`

# Look up rent for account size
`solana rent 4000`

# Size recap
`https://lorisleiva.com/create-a-solana-dapp-from-scratch/structuring-our-tweet-account#size-recap`

