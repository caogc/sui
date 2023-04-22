// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
    SuiTransactionBlockResponse,
    getTransactionSender,
} from '@mysten/sui.js';

export const getLabel = (transaction: SuiTransactionBlockResponse) => {
    const isSender = getTransactionSender(transaction);
    return isSender ? 'Send' : 'Receive';
};
