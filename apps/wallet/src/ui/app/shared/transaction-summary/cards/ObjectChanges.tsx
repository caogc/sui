import { ChevronDown12, ChevronUp12 } from '@mysten/icons';
import {
    type SuiObjectChangeCreated,
    type SuiObjectChangeMutated,
    formatAddress,
} from '@mysten/sui.js';
import { useState } from 'react';
import cx from 'classnames';

import { Card } from '../Card';
// import { useGetNFTMeta } from '_src/ui/app/hooks';
import { Text } from '_src/ui/app/shared/text';

const labels = {
    created: 'Create',
    mutated: 'Update',
    minted: 'Mint',
};

interface ObjectChangeEntryProps {
    changes:
        | (SuiObjectChangeMutated[] & { minted: boolean })
        | (SuiObjectChangeCreated[] & { minted: boolean });
    type: 'created' | 'mutated' | 'minted';
}

function ObjectChangeEntry({ changes, type }: ObjectChangeEntryProps) {
    const [expanded, setExpanded] = useState(true);
    if (!changes.length) return null;

    return (
        <Card heading="Changes">
            <div className={cx({ 'gap-2': expanded }, 'flex flex-col')}>
                <div
                    className="flex w-full flex-col gap-2 cursor-pointer"
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    <div className="flex w-full items-center gap-2">
                        <Text
                            variant="body"
                            weight="semibold"
                            color={
                                type === 'created'
                                    ? 'success-dark'
                                    : 'steel-darker'
                            }
                        >
                            {labels[type]}
                        </Text>
                        <div className="h-[1px] bg-gray-45 w-full" />
                        {expanded ? (
                            <ChevronUp12 className="text-gray-45" />
                        ) : (
                            <ChevronDown12 className="text-gray-45" />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {expanded &&
                        changes?.map(({ objectType, objectId }) => {
                            return (
                                <div
                                    key={objectId}
                                    className="grid grid-cols-2 items-center gap-2"
                                >
                                    <div className="flex flex-col gap-1">
                                        <Text
                                            variant="pBodySmall"
                                            color="steel-dark"
                                            truncate
                                        >
                                            Object
                                        </Text>

                                        <Text
                                            variant="pBodySmall"
                                            color="steel"
                                            truncate
                                            title={objectType}
                                        >
                                            {objectType}
                                        </Text>
                                    </div>
                                    <div className="justify-self-end">
                                        <Text
                                            variant="pBodySmall"
                                            color="hero-dark"
                                        >
                                            {formatAddress(objectId)}
                                        </Text>
                                    </div>
                                    {/* {minted && <NFTDetails objectId={objectId} />} */}
                                </div>
                            );
                        })}
                </div>
            </div>
        </Card>
    );
}

export function ObjectChanges({ changes }: { changes: any }) {
    if (!changes) return null;
    return (
        <>
            <ObjectChangeEntry type="mutated" changes={changes.mutated} />
            <ObjectChangeEntry type="created" changes={changes.created} />
        </>
    );
}
