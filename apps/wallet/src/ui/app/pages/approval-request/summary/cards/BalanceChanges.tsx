import { CoinFormat, formatBalance } from '@mysten/core';
import { Coin, formatAddress } from '@mysten/sui.js';
import { useState } from 'react';

import { Card } from '../Card';
import { type BalanceChangeSummary } from '../helpers/getBalanceChangeSummary';
import { useActiveAddress } from '_src/ui/app/hooks';
import { Text } from '_src/ui/app/shared/text';

interface BalanceChangesProps {
    changes: {
        positive: BalanceChangeSummary[];
        negative: BalanceChangeSummary[];
    } | null;
}

function BalanceChangeEntry({
    added,
    changes,
}: {
    added?: boolean;
    changes: BalanceChangeSummary[];
}) {
    const address = useActiveAddress();
    const [showAddress, setShowAddress] = useState(false);

    if (!changes) return null;
    return (
        <div className="flex flex-col divide-y gap-2 divide-gray-40">
            {changes.map(({ amount, type, recipient, owner }) => {
                return (
                    <>
                        <div
                            key={amount + type + recipient}
                            className="flex justify-between"
                        >
                            <Text variant="pBodySmall" color="steel-dark">
                                Amount
                            </Text>
                            <div className="flex">
                                <Text
                                    variant="pBodySmall"
                                    color={
                                        added ? 'success-dark' : 'issue-dark'
                                    }
                                >
                                    {formatBalance(amount, 9, CoinFormat.FULL)}{' '}
                                    {Coin.getCoinSymbol(type)}
                                </Text>
                            </div>
                        </div>
                        {recipient ? (
                            <div className="flex justify-between">
                                <Text variant="pBodySmall" color="steel-dark">
                                    Recipient
                                </Text>
                                {recipient}
                            </div>
                        ) : null}
                        {owner && (
                            <div className="flex justify-between">
                                <Text variant="pBodySmall" color="steel-dark">
                                    Owner
                                </Text>
                                <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowAddress((prev) => !prev)
                                    }
                                >
                                    <Text
                                        variant="pBodySmall"
                                        color="hero-dark"
                                    >
                                        {owner === address && !showAddress
                                            ? 'You'
                                            : formatAddress(owner)}
                                    </Text>
                                </div>
                            </div>
                        )}
                    </>
                );
            })}
        </div>
    );
}

export function BalanceChanges({ changes }: BalanceChangesProps) {
    if (!changes) return null;
    return (
        <Card heading="Balance Changes">
            <BalanceChangeEntry changes={changes.negative} />
            <BalanceChangeEntry added changes={changes.positive} />
        </Card>
    );
}
