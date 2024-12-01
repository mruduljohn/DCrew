'use client';

import React from 'react'
import Link from 'next/link';

const layout = ({ children }: { children: React.ReactNode }) => {

    // Define a new BottomNav component
    const BottomNav = () => {
        return (
            <div className="fixed bottom-0 left-0 w-full bg-blue-300 flex justify-evenly items-center py-4 rounded-t-lg shadow-lg">
                <Link href="/arhome">
                    <button
                        className="nes-btn is-primary px-4 py-2"
                    >
                        AR
                    </button>
                </Link>
                <Link href="/wallet">
                    <button
                        className="nes-btn is-success px-4 py-2"
                    // onClick={() => console.log('Wallet clicked')} // Add your wallet functionality here
                    >
                        WALLET
                    </button>
                </Link>
                <Link href="/map">
                    <button
                        className="nes-btn is-warning px-4 py-2"
                    >
                        MAP
                    </button>
                </Link>
            </div>
        );
    };

    return (
        <div>
            <BottomNav />
            {children}
        </div>
    )
}

export default layout