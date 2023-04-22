import { useFormatCoin } from '@mysten/core';
import { type GasCostSummary } from '@mysten/sui.js';

import { Text } from '../../text';
import { Card } from '../Card';
import { GAS_TYPE_ARG } from '_src/ui/app/redux/slices/sui-objects/Coin';

export function GasSummary({
    gasSummary,
}: {
    gasSummary?: GasCostSummary & { totalGas?: string };
}) {
    const [gas, symbol] = useFormatCoin(gasSummary?.totalGas, GAS_TYPE_ARG);

    if (!gasSummary) return null;
    return (
        <Card heading="Gas Fees">
            <div className="flex flex-col items-center gap-1">
                <div className="flex w-full justify-between">
                    <Text color="steel-dark" variant="bodySmall">
                        You Paid
                    </Text>
                    <Text color="steel-darker" variant="pBody" weight="medium">
                        {gas} {symbol}
                    </Text>
                </div>
            </div>
        </Card>
    );
}
