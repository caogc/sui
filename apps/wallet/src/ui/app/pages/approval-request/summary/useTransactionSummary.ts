import {
    type DryRunTransactionBlockResponse,
    getTotalGasUsed,
    type SuiAddress,
    type SuiObjectChange,
    type GasCostSummary,
    type SuiObjectChangeMutated,
    type SuiObjectChangeCreated,
    type SuiTransactionBlockResponse,
    // Coin,
} from '@mysten/sui.js';
import { useMemo } from 'react';

import { getAmount } from './helpers/getAmount';
import {
    type BalanceChangeSummary,
    getBalanceChangeSummary,
} from './helpers/getBalanceChangeSummary';
import { getObjectChangeSummary } from './helpers/objectChange';
import { useActiveAddress } from '_src/ui/app/hooks';

const summarize = (
    r: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress | null
) => {
    const { effects, objectChanges, balanceChanges } = r;
    if (!effects || !objectChanges || !balanceChanges) return null;
    const totalGas = getTotalGasUsed(effects);
    const objectSummary = getObjectChangeSummary(r, currentAddress);
    const balanceChangeSummary = getBalanceChangeSummary(r, currentAddress);
    const amount = getAmount(r, currentAddress);

    return {
        gas: { ...effects.gasUsed, total: totalGas?.toString() },
        objectSummary,
        amount,
        balanceChanges: balanceChangeSummary,
    };
};

export type DryRunTransactionSummary = {
    balanceChanges: {
        positive: BalanceChangeSummary[];
        negative: BalanceChangeSummary[];
    } | null;
    gas: GasCostSummary & {
        total?: string;
    };
    objectSummary: {
        mutated: SuiObjectChangeMutated[];
        created: SuiObjectChangeCreated[];
        transferred: SuiObjectChange[];
    } | null;
    amount: {
        total: string;
        totalGas: string;
        coinType: string;
    } | null;
};

export function useTransactionSummary({
    transaction,
}: {
    transaction?:
        | DryRunTransactionBlockResponse
        | SuiTransactionBlockResponse
        | null;
}) {
    const currentAddress = useActiveAddress();

    const summary = useMemo(() => {
        if (!transaction) {
            return null;
        }
        return summarize(transaction, currentAddress);
    }, [transaction, currentAddress]);

    return summary;
}
