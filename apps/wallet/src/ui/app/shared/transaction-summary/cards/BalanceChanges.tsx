import {
    type BalanceChangeSummary,
    CoinFormat,
    formatBalance,
} from '@mysten/core';
import { Coin, formatAddress } from '@mysten/sui.js';
import { useState } from 'react';

import { Card } from '../Card';
import { useActiveAddress } from '_src/ui/app/hooks';
import { Text } from '_src/ui/app/shared/text';

interface BalanceChangesProps {
    changes: BalanceChangeSummary[] | null;
}

function BalanceChangeEntry({ change }: { change: BalanceChangeSummary }) {
    const address = useActiveAddress();
    const [showAddress, setShowAddress] = useState(false);

    const { amount, coinType, owner } = change;
    const isPositive = BigInt(amount) > 0n;

    return (
        <div className="flex flex-col gap-2 only:pt-0 only:pb-0 first:pt-0 py-3">
            <div
                className="flex flex-col gap-2"
                key={`${isPositive ? '+' : '-'}-${coinType}-${amount}-${owner}`}
            >
                <div className="flex justify-between">
                    <Text variant="pBodySmall" color="steel-dark">
                        Amount
                    </Text>
                    <div className="flex">
                        <Text
                            variant="pBodySmall"
                            color={isPositive ? 'success-dark' : 'issue-dark'}
                        >
                            {isPositive ? '+' : ''}
                            {formatBalance(amount, 9, CoinFormat.FULL)}{' '}
                            {Coin.getCoinSymbol(coinType)}
                        </Text>
                    </div>
                </div>
                {/* {recipient ? (
                    <div className="flex justify-between">
                        <Text variant="pBodySmall" color="steel-dark">
                            Recipient
                        </Text>
                        {recipient}
                    </div>
                ) : null} */}
                {owner && (
                    <div className="flex justify-between">
                        <Text variant="pBodySmall" color="steel-dark">
                            Owner
                        </Text>
                        <div
                            className="cursor-pointer"
                            onClick={() => setShowAddress((prev) => !prev)}
                        >
                            <Text variant="pBodySmall" color="hero-dark">
                                {owner === address && !showAddress
                                    ? 'You'
                                    : formatAddress(owner)}
                            </Text>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function BalanceChanges({ changes }: BalanceChangesProps) {
    if (!changes) return null;
    return (
        <Card heading="Balance Changes">
            <div className="divide-solid divide-x-0 divide-y-1 divide-gray-40">
                {changes.map((change) => {
                    return <BalanceChangeEntry change={change} />;
                })}
            </div>
        </Card>
    );
}
