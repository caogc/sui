// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useTransactionSummary } from '@mysten/core';
import {
    type SuiTransactionBlockResponse,
    type SuiAddress,
} from '@mysten/sui.js';

import { DateCard } from '../../shared/date-card';
import { TransactionSummary } from '../../shared/transaction-summary';
import { StatusIcon } from './StatusIcon';
// import { TxnImage } from '_components/transactions-card/TxnImage';

type ReceiptCardProps = {
    txn: SuiTransactionBlockResponse;
    activeAddress: SuiAddress;
};

function TransactionStatus({
    success,
    timestamp,
}: {
    success: boolean;
    timestamp?: string;
}) {
    return (
        <div className="flex flex-col gap-3 items-center justify-center mb-4">
            <StatusIcon status={success} />
            {timestamp && <DateCard timestamp={Number(timestamp)} size="md" />}
        </div>
    );
}

export function ReceiptCard2({ txn, activeAddress }: ReceiptCardProps) {
    const summary = useTransactionSummary({
        transaction: txn,
        currentAddress: activeAddress,
    });

    return (
        <div className="block relative w-full">
            <TransactionStatus
                success={summary?.status === 'success'}
                timestamp={txn.timestampMs}
            />
            <section className="-mx-5 bg-[#6FBCF01A]">
                <div>
                    <div className="px-5 py-10">
                        <TransactionSummary summary={summary} />
                    </div>
                </div>
            </section>
        </div>
    );
}
