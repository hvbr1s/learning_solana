# Tutorial
`https://lorisleiva.com/create-a-solana-dapp-from-scratch/getting-started-with-solana-and-anchor`

# Compiles your program.`
`anchor build`

# Deploys your compiled program.
`anchor deploy`

# Run local ledger
`solana-test-validator`

# Runs a new empty local ledger.
`solana-test-validator --reset`

# Get program ID
`solana address -k target/deploy/<your-project-name>-keypair.json`

# Run tests from the `Anchor.toml` file
`anchor run test`

# Look up rent for account size
`solana rent 4000`

# Size recap
`https://lorisleiva.com/create-a-solana-dapp-from-scratch/structuring-our-tweet-account#size-recap`

