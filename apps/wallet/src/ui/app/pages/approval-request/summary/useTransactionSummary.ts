import {
    type DryRunTransactionBlockResponse,
    getTotalGasUsed,
    type TransactionBlock,
    SUI_TYPE_ARG,
    type SuiAddress,
    type SuiObjectChange,
    type GasCostSummary,
    COIN_TYPE_ARG_REGEX,
    type SuiObjectChangeMutated,
    type SuiObjectChangeCreated,
    // Coin,
} from '@mysten/sui.js';
import { useMemo } from 'react';

import { useActiveAddress, useTransactionDryRun } from '_src/ui/app/hooks';

const getObjectChangeSummary = (
    address: SuiAddress | null,
    objectChanges: SuiObjectChange[]
) => {
    const mutated = objectChanges.filter(
        (change) =>
            change.type === 'mutated' &&
            !change.objectType.match(COIN_TYPE_ARG_REGEX)
    );

    const created = objectChanges.filter(
        (change) =>
            change.type === 'created' &&
            change.sender === address &&
            !change.objectType.match(COIN_TYPE_ARG_REGEX)
    );

    const transferred = objectChanges.filter(
        (objectChange) =>
            objectChange.type === 'mutated' &&
            objectChange.sender === address &&
            typeof objectChange.owner !== 'string' &&
            'AddressOwner' in objectChange.owner &&
            objectChange.sender !== objectChange.owner.AddressOwner
    );

    // const mutated = objectChanges.filter(
    //     (objectChange) =>
    //         objectChange.type === 'mutated' &&
    //         objectChange.sender === address &&
    //         typeof objectChange.owner !== 'string' &&
    //         'AddressOwner' in objectChange.owner &&
    //         objectChange.sender !== objectChange.owner.AddressOwner
    // );

    // const minted = objectChanges.filter(
    //     (objectChange) =>
    //         objectChange.type === 'created' &&
    //         objectChange.sender === address &&
    //         typeof objectChange.owner !== 'string' &&
    //         'AddressOwner' in objectChange.owner &&
    //         objectChange.sender === objectChange.owner.AddressOwner
    // );

    return {
        mutated,
        created,
        transferred,
    };
};

const summarize = (
    r: DryRunTransactionBlockResponse,
    currentAddress: SuiAddress | null
) => {
    const { effects, objectChanges, balanceChanges } = r;
    const gasUsed = getTotalGasUsed(effects);

    // gas summary
    const gas = {
        ...effects?.gasUsed,
        total: getTotalGasUsed(effects)?.toString(),
    };

    const balanceAdditions = balanceChanges
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

    const balanceReductions = balanceChanges.map((balanceChange) => {
        let amount = BigInt(balanceChange.amount);
        if (gasUsed && balanceChange.coinType === SUI_TYPE_ARG) {
            amount = amount + BigInt(gasUsed);
        }

        const recipient = balanceChanges.find(
            (bc) =>
                balanceChange.coinType === bc.coinType &&
                BigInt(balanceChange.amount) === BigInt(bc.amount) * -1n
        );

        const owner =
            (typeof balanceChange.owner === 'object' &&
                'AddressOwner' in balanceChange.owner &&
                balanceChange.owner.AddressOwner) ||
            undefined;

        const r =
            (recipient &&
                typeof recipient.owner === 'object' &&
                'AddressOwner' in recipient.owner &&
                recipient.owner.AddressOwner &&
                recipient.owner.AddressOwner) ||
            undefined;
        return {
            type: balanceChange.coinType,
            amount: amount.toString(),
            recipient: r,
            owner,
        };
    });

    const totalReductions =
        balanceChanges
            .filter(
                (balanceChange) =>
                    typeof balanceChange.owner === 'object' &&
                    'AddressOwner' in balanceChange.owner &&
                    balanceChange.owner.AddressOwner === currentAddress
            )
            .reduce(
                (total, reduction) => BigInt(total) + BigInt(reduction.amount),
                0n
            ) * -1n;

    const rawAmount = totalReductions - BigInt(gas.total ?? 0n);

    const objectSummary = getObjectChangeSummary(currentAddress, objectChanges);

    return {
        balanceAdditions,
        balanceReductions,
        gas,
        objectSummary,
        rawAmount: rawAmount.toString(),
    };
};

export type DryRunTransactionSummary = {
    balanceAdditions: {
        type: string;
        amount: string;
    }[];
    balanceReductions: {
        type: string;
        amount: string;
        recipient?: SuiAddress;
        owner?: string;
    }[];
    gas: GasCostSummary & {
        total?: string;
    };
    objectSummary: {
        mutated: SuiObjectChangeMutated[];
        created: SuiObjectChangeCreated[];
        transferred: SuiObjectChange[];
    };
    rawAmount: string;
};

export function useTransactionSummary({
    transactionBlock,
    address,
}: {
    transactionBlock: TransactionBlock;
    address: string;
}) {
    const currentAddress = useActiveAddress();
    const { data } = useTransactionDryRun(address, transactionBlock);
    console.log(data);

    const summary = useMemo(() => {
        if (!data) {
            return null;
        }
        return summarize(data, currentAddress);
    }, [data, currentAddress]);

    return summary;
}
