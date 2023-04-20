import {
    COIN_TYPE_ARG_REGEX,
    type SuiTransactionBlockResponse,
    // type SuiObjectChangeMutated,
    type DryRunTransactionBlockResponse,
    type SuiAddress,
    type SuiObjectChange,
    // type SuiObjectChangeCreated,
} from '@mysten/sui.js';

export type ObjectChangeSummary = {
    mutated: any[]; // todo: any
    created: any[];
    transferred: SuiObjectChange[];
} | null;

export const getObjectChangeSummary = (
    dryRun: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress: SuiAddress
): ObjectChangeSummary => {
    const { objectChanges } = dryRun;
    if (!objectChanges) return null;

    // todo: should we filter coins here?
    const mutated = objectChanges.filter(
        (change) =>
            change.type === 'mutated' &&
            !change.objectType.match(COIN_TYPE_ARG_REGEX)
    );

    // todo: should we filter coins here?
    const created = objectChanges.filter(
        (change) =>
            change.type === 'created' &&
            change.sender === currentAddress &&
            !change.objectType.match(COIN_TYPE_ARG_REGEX)
    );

    // todo: deleted

    // todo: transferred
    const transferred = objectChanges.filter(
        (change) =>
            change.type === 'mutated' &&
            change.sender === currentAddress &&
            typeof change.owner === 'object' &&
            'AddressOwner' in change.owner &&
            change.sender !== change.owner.AddressOwner
    );

    return {
        mutated,
        created,
        transferred,
    };
};
