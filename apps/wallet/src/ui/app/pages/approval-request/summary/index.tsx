import { formatBalance } from '@mysten/core';
import { Coin, formatAddress } from '@mysten/sui.js';

import { type DryRunTransactionSummary } from './useTransactionSummary';
import { useActiveAddress } from '_src/ui/app/hooks';
import { Heading } from '_src/ui/app/shared/heading';
import { Text } from '_src/ui/app/shared/text';
import { useState } from 'react';

function BalanceChangeSummaryCard({
    summary,
    title,
}: {
    summary: DryRunTransactionSummary;
    title: string;
}) {
    const address = useActiveAddress();
    const [showAddress, setShowAddress] = useState(false);
    return (
        <div className="bg-white flex flex-col shadow-summary-card p-4.5 rounded-2xl">
            <div className="flex mb-4.5">
                <Heading variant="heading6" color="steel-darker">
                    {title}
                </Heading>
            </div>
            <div className="flex flex-col divide-y gap-2 divide-gray-40">
                {summary?.balanceReductions?.map((_balanceReduction) => (
                    <>
                        <div
                            key={
                                _balanceReduction.amount +
                                _balanceReduction.type +
                                _balanceReduction.recipient
                            }
                            className="flex justify-between"
                        >
                            <Text variant="pBodySmall" color="steel-dark">
                                Amount
                            </Text>
                            <div className="flex">
                                <Text variant="pBodySmall" color="issue-dark">
                                    {formatBalance(_balanceReduction.amount, 9)}{' '}
                                    {Coin.getCoinSymbol(_balanceReduction.type)}
                                </Text>
                            </div>
                        </div>
                        {_balanceReduction.recipient ? (
                            <div className="flex justify-between">
                                <Text variant="pBodySmall" color="steel-dark">
                                    Recipient
                                </Text>

                                {_balanceReduction.recipient}
                            </div>
                        ) : null}
                        {_balanceReduction.owner ? (
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
                                        {_balanceReduction.owner === address &&
                                        !showAddress
                                            ? 'You'
                                            : formatAddress(
                                                  _balanceReduction.owner
                                              )}
                                    </Text>
                                </div>
                            </div>
                        ) : null}
                    </>
                ))}
            </div>
        </div>
    );
}

function ObjectCreatedSummaryCard({
    summary,
    title,
}: {
    summary: DryRunTransactionSummary;
    title: string;
}) {
    return (
        <div className="bg-white flex flex-col shadow-summary-card p-4.5 rounded-2xl">
            <div className="flex items-center mb-4.5">
                <Heading variant="heading6" color="steel-darker">
                    {title}
                </Heading>
            </div>
            <div className="flex w-full flex-col divide-y gap-2 divide-gray-40">
                <div className="flex w-full items-center gap-2">
                    <Text variant="body" weight="semibold" color="success-dark">
                        Create
                    </Text>
                    <div className="h-[1px] bg-gray-45 w-full" />
                </div>

                {summary?.objectSummary?.created?.map((_object) => (
                    <>
                        <div
                            key="created"
                            className="grid grid-cols-2 items-center"
                        >
                            <div className="">
                                <div className="flex flex-col gap-1">
                                    <Text
                                        variant="pBodySmall"
                                        color="steel-dark"
                                        truncate
                                    >
                                        Object
                                    </Text>
                                    <Text
                                        variant="pBodySmall"
                                        color="steel"
                                        truncate
                                        title={_object.objectType}
                                    >
                                        {_object.objectType}
                                    </Text>
                                </div>
                            </div>
                            <div className="justify-self-end">
                                <Text variant="pBodySmall" color="hero-dark">
                                    {formatAddress(_object.objectId)}
                                </Text>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
}

function ObjectUpdatedSummaryCard({
    summary,
    title,
}: {
    summary: DryRunTransactionSummary;
    title: string;
}) {
    return (
        <div className="bg-white flex flex-col p-4.5 shadow-summary-card rounded-2xl">
            <div className="flex items-center mb-4.5">
                <Heading variant="heading6" color="steel-darker">
                    {title}
                </Heading>
            </div>
            <div className="flex w-full flex-col divide-y gap-2 divide-gray-40">
                <div className="flex w-full items-center gap-2">
                    <Text variant="body" weight="semibold" color="steel-darker">
                        Updated
                    </Text>
                    <div className="h-[1px] bg-gray-45 w-full" />
                </div>

                {summary?.objectSummary?.mutated?.map((_object) => (
                    <>
                        <div
                            key="created"
                            className="grid grid-cols-2 items-center"
                        >
                            <div className="">
                                <div className="flex flex-col gap-1">
                                    <Text
                                        variant="pBodySmall"
                                        color="steel-dark"
                                        truncate
                                    >
                                        Object
                                    </Text>
                                    <Text
                                        variant="pBodySmall"
                                        color="steel"
                                        truncate
                                        title={_object.objectType}
                                    >
                                        {_object.objectType}
                                    </Text>
                                </div>
                            </div>
                            <div className="justify-self-end">
                                <Text variant="pBodySmall" color="hero-dark">
                                    {formatAddress(_object.objectId)}
                                </Text>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
}

export function TransactionSummary({ summary }: { summary?: any | null }) {
    return summary ? (
        <div className="flex flex-col gap-4">
            <BalanceChangeSummaryCard
                title="Balance Changes"
                summary={summary}
            />
            <ObjectUpdatedSummaryCard title="Changes" summary={summary} />
            <ObjectCreatedSummaryCard title="Changes" summary={summary} />
        </div>
    ) : null;
}
