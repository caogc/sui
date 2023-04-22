// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
    getTotalGasUsed,
    type SuiTransactionBlockResponse,
    type SuiAddress,
    type DryRunTransactionBlockResponse,
} from '@mysten/sui.js';

export type AmountSummary = {
    total: string;
    coinType: string;
    totalGas: string;
} | null;

export function getAmount(
    data: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress?: SuiAddress | null
) {
    const { effects, balanceChanges } = data;

    if (!effects || !balanceChanges) return null;

    const totalGas = getTotalGasUsed(effects) || 0n;

    const isOwnerAmount = (balanceChange: (typeof balanceChanges)[0]) =>
        typeof balanceChange.owner === 'object' &&
        'AddressOwner' in balanceChange.owner &&
        balanceChange.owner.AddressOwner === currentAddress;

    const ownerAmount = balanceChanges.filter(isOwnerAmount);

    const total = ownerAmount.reduce(
        (total, bc) => BigInt(total) + BigInt(bc.amount),
        0n
    );

    const totalAmount = (
        total < 0n ? total * -1n - totalGas : total + totalGas
    ).toString();

    const coinType = ownerAmount[0]?.coinType;
    return {
        total: totalAmount,
        totalGas: totalGas.toString(),
        coinType,
    };
}
