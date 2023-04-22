// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useGetObject } from '@mysten/core';
import { getObjectDisplay } from '@mysten/sui.js';
import { useMemo } from 'react';

export type NFTMetadata = {
    name: string | null;
    description: string | null;
    url: string;
};

export function useGetNFTMeta(objectID: string) {
    const resp = useGetObject(objectID);
    const nftMeta = useMemo(() => {
        if (!resp.data) return null;
        const display = getObjectDisplay(resp.data);
        if (!display.data) {
            return null;
        }
        return display;
    }, [resp]);
    return {
        ...resp,
        data: nftMeta,
    };
}
