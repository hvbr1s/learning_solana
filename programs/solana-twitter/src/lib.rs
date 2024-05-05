use anchor_lang::prelude::*;

declare_id!("2FoavwpHFnnfV3hHppLDQ6pFSvhbGrxd4QCmy9iWAwn7");

#[program]
pub mod solana_twitter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
