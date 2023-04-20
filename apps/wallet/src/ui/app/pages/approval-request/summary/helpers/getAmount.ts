import {
    getTotalGasUsed,
    type SuiTransactionBlockResponse,
    type SuiAddress,
    type DryRunTransactionBlockResponse,
} from '@mysten/sui.js';

export type AmountSummary = {
    total: bigint;
    coinType: string;
    totalGas: bigint;
} | null;

export function getAmount(
    data: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress
) {
    const { effects, balanceChanges } = data;
    if (!effects || !balanceChanges) return null;

    const totalGas = getTotalGasUsed(effects) || 0n;

    const isOwnerAmount = (balanceChange: (typeof balanceChanges)[0]) =>
        typeof balanceChange.owner === 'object' &&
        'AddressOwner' in balanceChange.owner &&
        balanceChange.owner.AddressOwner === currentAddress;

    const ownerAmount = balanceChanges.filter(isOwnerAmount);
    const totalAmount =
        ownerAmount.reduce(
            (total, bc) => BigInt(total) + BigInt(bc.amount),
            0n
        ) * -1n;
    const coinType = ownerAmount[0]?.coinType;
    return { total: totalAmount, totalGas: totalGas, coinType };
}
