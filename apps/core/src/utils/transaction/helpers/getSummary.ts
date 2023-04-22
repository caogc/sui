// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
    type SuiAddress,
    type DryRunTransactionBlockResponse,
    type GasCostSummary,
    getTotalGasUsed,
    SuiTransactionBlockResponse,
} from '@mysten/sui.js';

import { getAmount } from './getAmount';
import {
    type BalanceChangeSummary,
    getBalanceChangeSummary,
} from './getBalanceChangeSummary';
import { getObjectChangeSummary } from './getObjectChangeSummary';

export type TransactionSummary = {
    digest?: string;
    timestamp?: string;
    balanceChanges: BalanceChangeSummary[] | null;
    gas?: GasCostSummary & {
        totalGas?: string;
    };
    objectSummary: {
        mutated: any;
        created: any;
        transferred: any;
    } | null;
    amount: {
        total: string;
        totalGas: string;
        coinType: string;
    } | null;
} | null;

export const getTransactionSummary = (
    transaction: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress
): TransactionSummary => {
    const { effects } = transaction;
    if (!effects) return null;

    const totalGas = getTotalGasUsed(effects) || 0n;

    const amount = getAmount(transaction, currentAddress);
    const balanceChangeSummary = getBalanceChangeSummary(transaction);
    const objectChangeSummary = getObjectChangeSummary(
        transaction,
        currentAddress
    );

    return {
        balanceChanges: balanceChangeSummary,
        gas: {
            ...effects.gasUsed,
            totalGas: totalGas.toString(),
        },
        objectSummary: objectChangeSummary,
        amount,
    };
};
