module Airdrop {

    use std::signer;
    use std::vector;
    use aptos_framework::token;

    struct AirdropInfo has key {
        creator: address, // Address of the airdrop creator
        token_type: token::TokenType, // Type of token being airdropped
        collected: vector<address>, // Addresses that have collected the token
        max_limit: u64, // Max tokens each address can collect
    }

    public fun initialize_airdrop(
        creator: &signer,
        token_type: token::TokenType,
        max_limit: u64
    ) {
        let airdrop_info = AirdropInfo {
            creator: signer::address_of(creator),
            token_type,
            collected: vector::empty<address>(),
            max_limit,
        };
        move_to(creator, airdrop_info);
    }

    public fun collect_airdrop(collector: &signer, creator: address) {
        let airdrop_info = borrow_global_mut<AirdropInfo>(creator);

        // Ensure the collector hasn't already collected the token
        assert!(
            !has_collected(&airdrop_info.collected, signer::address_of(collector)),
            1, // Error Code: Already Collected
        );

        // Add the collector to the list
        vector::push_back(&mut airdrop_info.collected, signer::address_of(collector));

        // Mint and transfer tokens to the collector
        let token_amount = airdrop_info.max_limit;
        token::transfer(
            &airdrop_info.creator,
            signer::address_of(collector),
            airdrop_info.token_type,
            token_amount
        );
    }

    fun has_collected(collected_list: &vector<address>, collector: address): bool {
        let len = vector::length(collected_list);
        let mut i = 0;
        while (i < len) {
            if (vector::borrow(collected_list, i) == collector) {
                return true;
            }
            i = i + 1;
        }
        false
    }
}
