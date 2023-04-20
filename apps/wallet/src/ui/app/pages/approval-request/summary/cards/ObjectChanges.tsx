import {
    type SuiObjectChangeCreated,
    type SuiObjectChangeMutated,
    formatAddress,
} from '@mysten/sui.js';

import { Card } from '../Card';
import { type ObjectChangeSummary } from '../helpers/objectChange';
import { Text } from '_src/ui/app/shared/text';

type ChangeType = 'created' | 'mutated';

const labels: Record<ChangeType, string> = {
    created: 'Create',
    mutated: 'Update',
};

function ObjectChangeEntry({
    changes,
    type,
}: {
    type: ChangeType;
    changes: SuiObjectChangeMutated[] | SuiObjectChangeCreated[];
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full flex-col divide-y gap-2 divide-gray-40">
                <div className="flex w-full items-center gap-2">
                    <Text
                        variant="body"
                        weight="semibold"
                        color={
                            type === 'created' ? 'success-dark' : 'steel-darker'
                        }
                    >
                        {labels[type]}
                    </Text>
                    <div className="h-[1px] bg-gray-45 w-full" />
                </div>
            </div>
            {changes?.map(({ objectType, objectId }) => {
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
                            <Text variant="pBodySmall" color="hero-dark">
                                {formatAddress(objectId)}
                            </Text>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function ObjectChanges({ summary }: { summary: ObjectChangeSummary }) {
    return (
        <>
            <Card heading="Changes">
                <ObjectChangeEntry type="mutated" changes={summary.mutated} />
            </Card>
            <Card heading="Changes">
                <ObjectChangeEntry type="created" changes={summary.created} />
            </Card>
        </>
    );
}
