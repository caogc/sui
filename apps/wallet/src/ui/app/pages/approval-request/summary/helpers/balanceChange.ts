import {
    type DryRunTransactionBlockResponse,
    type SuiAddress,
    type SuiTransactionBlockResponse,
    // getTotalGasUsed,
} from '@mysten/sui.js';

export type BalanceChangeSummary = {
    type: string;
    amount: string;
    recipient?: SuiAddress;
    owner?: SuiAddress;
} | null;

export const getBalanceChangeSummary = (
    transaction: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress
) => {
    const { balanceChanges } = transaction;
    if (!balanceChanges) return null;
    const positive = balanceChanges
        .filter(
            (balanceChange) =>
                typeof balanceChange.owner === 'object' &&
                'AddressOwner' in balanceChange.owner &&
                balanceChange.owner.AddressOwner === currentAddress &&
                BigInt(balanceChange.amount) > 0n
        )
        .map((bc) => ({
            type: bc.coinType,
            amount: bc.amount.toString(),
        }));
    const negative = balanceChanges.map((balanceChange) => {
        const amount = BigInt(balanceChange.amount);
        const owner =
            (typeof balanceChange.owner === 'object' &&
                'AddressOwner' in balanceChange.owner &&
                balanceChange.owner.AddressOwner) ||
            undefined;
        const recipient = balanceChanges.find(
            (bc) =>
                balanceChange.coinType === bc.coinType &&
                BigInt(balanceChange.amount) === BigInt(bc.amount) * -1n
        );
        const recipientAddress =
            (recipient &&
                typeof recipient.owner === 'object' &&
                'AddressOwner' in recipient.owner &&
                recipient.owner.AddressOwner &&
                recipient.owner.AddressOwner) ||
            undefined;
        return {
            type: balanceChange.coinType,
            amount: amount.toString(),
            recipient: recipientAddress,
            owner,
        };
    });
    return {
        positive,
        negative,
    };
};
