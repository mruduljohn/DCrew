module token_transfer::token_transfer {
    use aptos_framework::coin;
    use std::signer;

    // Error codes
    const EINVALID_AMOUNT: u64 = 1;

    // Transfer tokens from sender to recipient
    public entry fun transfer<CoinType>(
        sender: &signer, 
        recipient: address, 
        amount: u64
    ) {
        // Validate amount is positive
        assert!(amount > 0, EINVALID_AMOUNT);

        // Perform the coin transfer
        coin::transfer<CoinType>(sender, recipient, amount);
    }

    // Optional: Function to check balance
    #[view]
    public fun get_balance<CoinType>(account: address): u64 {
        coin::balance<CoinType>(account)
    }
}