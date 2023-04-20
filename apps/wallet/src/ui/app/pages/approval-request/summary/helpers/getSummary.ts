import {
    type SuiAddress,
    type DryRunTransactionBlockResponse,
    type GasCostSummary,
    getTotalGasUsed,
    type SuiTransactionBlockResponse,
    is,
} from '@mysten/sui.js';

import {
    type BalanceChangeSummary,
    getBalanceChangeSummary,
} from './balanceChange';
import { type AmountSummary, getAmount } from './getAmount';
import {
    type ObjectChangeSummary,
    getObjectChangeSummary,
} from './objectChange';

export type DryRunTransactionSummary = {
    balanceChanges: {
        positive: BalanceChangeSummary[];
        negative: BalanceChangeSummary[];
    } | null;
    gas: GasCostSummary & {
        total?: string;
    };
    objectSummary: ObjectChangeSummary;
    amount: AmountSummary;
} | null;

export const getTransactionSummary = (
    transaction: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress
): DryRunTransactionSummary => {
    const { effects } = transaction;
    if (!effects) return null;

    const totalGas = getTotalGasUsed(effects) || 0n;
    const amount = getAmount(transaction, currentAddress);
    const balanceChangeSummary = getBalanceChangeSummary(
        transaction,
        currentAddress
    );
    const objectChangeSummary = getObjectChangeSummary(
        transaction,
        currentAddress
    );

    return {
        balanceChanges: balanceChangeSummary,
        gas: {
            ...effects.gasUsed,
            total: totalGas.toString(),
        },
        objectSummary: objectChangeSummary,
        amount,
    };
};
