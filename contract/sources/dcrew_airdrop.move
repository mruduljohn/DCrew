module dcrew_address::dcrew_airdrop {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    /// Errors
    const EINVALID_AMOUNT: u64 = 1;
    const EINVALID_TIME: u64 = 2;
    const EALREADY_CLAIMED: u64 = 3;
    const EINVALID_LOCATION: u64 = 4;

    struct AirdropLocation has store {
        latitude: u64,
        longitude: u64,
        radius: u64,
    }

    struct Airdrop has key {
        token_address: address,
        total_amount: u64,
        max_per_user: u64,
        start_time: u64,
        end_time: u64,
        locations: vector<AirdropLocation>,
        claimed_amounts: Table<address, u64>,
    }

    public entry fun create_airdrop(
        creator: &signer,
        token_address: address,
        total_amount: u64,
        max_per_user: u64,
        start_time: u64,
        end_time: u64,
        locations: vector<AirdropLocation>
    ) {
        let airdrop = Airdrop {
            token_address,
            total_amount,
            max_per_user,
            start_time,
            end_time,
            locations,
            claimed_amounts: table::new(),
        };
        
        move_to(creator, airdrop);
    }

    public entry fun claim_airdrop(
        claimer: &signer,
        creator_address: address,
        latitude: u64,
        longitude: u64,
        amount: u64
    ) acquires Airdrop {
        let airdrop = borrow_global_mut<Airdrop>(creator_address);
        let claimer_address = signer::address_of(claimer);
        
        // Check if within time bounds
        let current_time = timestamp::now_seconds();
        assert!(current_time >= airdrop.start_time && current_time <= airdrop.end_time, EINVALID_TIME);

        // Check if location is valid
        let valid_location = false;
        let i = 0;
        while (i < vector::length(&airdrop.locations)) {
            let location = vector::borrow(&airdrop.locations, i);
            if (is_within_radius(latitude, longitude, location)) {
                valid_location = true;
                break
            };
            i = i + 1;
        };
        assert!(valid_location, EINVALID_LOCATION);

        // Check if user hasn't exceeded max claim
        let claimed = if (table::contains(&airdrop.claimed_amounts, claimer_address)) {
            *table::borrow(&airdrop.claimed_amounts, claimer_address)
        } else {
            0
        };
        
        assert!(claimed + amount <= airdrop.max_per_user, EALREADY_CLAIMED);

        // Update claimed amount
        if (table::contains(&airdrop.claimed_amounts, claimer_address)) {
            let user_claimed = table::borrow_mut(&mut airdrop.claimed_amounts, claimer_address);
            *user_claimed = claimed + amount;
        } else {
            table::add(&mut airdrop.claimed_amounts, claimer_address, amount);
        };

        // Transfer tokens
        coin::transfer<CoinType>(creator_address, claimer_address, amount);
    }

    fun is_within_radius(
        user_lat: u64,
        user_lng: u64,
        location: &AirdropLocation,
    ): bool {
        // Implement distance calculation logic here
        // For simplicity, you might want to use a bounding box first
        // and then implement proper haversine formula if needed
        true // Placeholder
    }
} 