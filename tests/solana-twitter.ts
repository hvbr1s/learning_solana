import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaTwitter } from "../target/types/solana_twitter";
import * as assert from "assert";
import * as bs58 from "bs58";

describe("solana-twitter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

      it('can send a new tweet', async () => {
        const tweet = anchor.web3.Keypair.generate();
        await program.methods
          .sendTweet('AI', "It's magic!")
          .accounts({
            tweet: tweet.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([tweet])
          .rpc();

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
        //console.log(tweetAccount)
        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'AI');
        assert.equal(tweetAccount.content, "It's magic!");
        assert.ok(tweetAccount.timestamp);
    });

    it('can send a new tweet without a topic', async () => {
      const tweet = anchor.web3.Keypair.generate();
      await program.methods
        .sendTweet('', 'yo!')
        .accounts({
          tweet: tweet.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tweet])
        .rpc();

      // Fetch the account details of the created tweet.
      const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
      //console.log(tweetAccount)
      // Ensure it has the right data.
      assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
      assert.equal(tweetAccount.topic, '');
      assert.equal(tweetAccount.content, 'yo!');
      assert.ok(tweetAccount.timestamp);
    });

    it('can send a new tweet from  different author', async () => {

      // Generate other user
      const otherUser = anchor.web3.Keypair.generate()    
      const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
      await program.provider.connection.confirmTransaction(signature);

      // Call 'SendTweet' on behalf of the other user
      const tweet = anchor.web3.Keypair.generate();
      await program.methods
        .sendTweet('AI', 'LLMs will rule the world!')
        .accounts({
          tweet: tweet.publicKey,
          author: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([otherUser, tweet])
        .rpc();

      // Fetch the account details of the created tweet.
      const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
      //console.log(tweetAccount)
      // Ensure it has the right data.
      assert.equal(tweetAccount.author.toBase58(), otherUser.publicKey.toBase58());
      assert.equal(tweetAccount.topic, 'AI');
      assert.equal(tweetAccount.content, 'LLMs will rule the world!');
      assert.ok(tweetAccount.timestamp);
    });

    it('cannot provide a topic with more than 50 characters', async () =>{
      try{

        const tweet = anchor.web3.Keypair.generate();
        const topicWith51Characters = 'x'.repeat(51);
        await program.methods
        .sendTweet(topicWith51Characters, 'LLMs will rule the world!')
        .accounts({
          tweet: tweet.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tweet])
        .rpc();

      }
      catch (error){
        assert.equal(error.msg, 'Your topic exceeds 50 characters!');
        return;
      }

      assert.fail('The instruction should have failed with a 51-character topic');


    });

    it('cannot provide a content with more than 280 characters', async () =>{
      try{

        const tweet = anchor.web3.Keypair.generate();
        const contentWith281Characters = 'x'.repeat(282);
        await program.methods
        .sendTweet("AI", contentWith281Characters)
        .accounts({
          tweet: tweet.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tweet])
        .rpc();

      }
      catch (error){
        assert.equal(error.msg, 'The provided content should be 280 characters long maximum.');
        return;
      }

      assert.fail('The instruction should have failed with a 281-character content.');


    });

    it('can fetch all tweets', async () => {
      const tweetAccounts = await program.account.tweet.all();
      assert.equal(tweetAccounts.length, 3);
      console.log(tweetAccounts)
    });

    it('can filter tweets by author', async () =>{
      const authorPublicKey = program.provider.wallet.publicKey
      const tweetAccounts = await program.account.tweet.all([
          {
              memcmp: {
                  offset: 8, // Discriminator.
                  bytes: authorPublicKey.toBase58(),
              }
          }
      ]);
      assert.equal(tweetAccounts.length, 2);
      assert.ok(tweetAccounts.every(tweetAccount => {
        return tweetAccount.account.author.toBase58() === authorPublicKey.toBase58()
      }));
    });

    it('can filter tweets by topics', async () => {
      const tweetAccounts = await program.account.tweet.all([
          {
              memcmp: {
                  offset: 8 + // Discriminator.
                      32 + // Author public key.
                      8 + // Timestamp.
                      4, // Topic string prefix.
                  bytes: bs58.encode(Buffer.from('AI')),
              }
          }
      ]);
  
      assert.equal(tweetAccounts.length, 2);
      assert.ok(tweetAccounts.every(tweetAccount => {
          return tweetAccount.account.topic === 'AI'
      }));
    }); 
});