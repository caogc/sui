import {
    type DryRunTransactionBlockResponse,
    type SuiAddress,
    type SuiTransactionBlockResponse,
} from '@mysten/sui.js';

export type BalanceChangeSummary = {
    type: string;
    amount: string;
    recipient?: SuiAddress;
    owner?: SuiAddress;
};

export const getBalanceChangeSummary = (
    transaction: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress | null
) => {
    const { balanceChanges, effects } = transaction;
    if (!balanceChanges || !effects) return null;

    const negative = balanceChanges
        .filter(
            (balanceChange) =>
                typeof balanceChange.owner === 'object' &&
                'AddressOwner' in balanceChange.owner &&
                balanceChange.owner.AddressOwner === currentAddress &&
                BigInt(balanceChange.amount) < 0n
        )
        .map((balanceChange) => {
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

    return {
        positive,
        negative,
    };
};
