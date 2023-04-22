// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
    COIN_TYPE_ARG_REGEX,
    type SuiTransactionBlockResponse,
    type SuiAddress,
    type DryRunTransactionBlockResponse,
} from '@mysten/sui.js';

export const getObjectChangeSummary = (
    transaction: DryRunTransactionBlockResponse | SuiTransactionBlockResponse,
    currentAddress?: SuiAddress | null
) => {
    const { objectChanges } = transaction;
    if (!objectChanges) return null;

    // todo: should we filter coins here?
    const mutated = objectChanges.filter((change) => change.type === 'mutated');

    const created = objectChanges
        .filter(
            (change) =>
                change.type === 'created' && change.sender === currentAddress
        )
        .map((change) => ({
            ...change,
            minted:
                change.type === 'created' &&
                change.sender === currentAddress &&
                typeof change.owner === 'object' &&
                'AddressOwner' in change.owner &&
                change.owner.AddressOwner === currentAddress &&
                !change.objectType.match(COIN_TYPE_ARG_REGEX),
        }));

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
