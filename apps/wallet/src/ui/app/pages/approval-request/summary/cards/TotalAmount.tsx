import { useFormatCoin } from '@mysten/core';

import { Card } from '../Card';
import { Heading } from '_src/ui/app/shared/heading';
import { Text } from '_src/ui/app/shared/text';

export function TotalAmount({
    amount,
    coinType,
}: {
    amount?: string;
    coinType?: string;
}) {
    const [formatted, symbol] = useFormatCoin(amount, coinType);
    if (!amount) return null;
    return (
        <Card>
            <div className="flex justify-between">
                <Text color="steel-darker" variant="pBody">
                    Total Amount
                </Text>
                <div className="flex gap-2 items-center">
                    <Heading color="steel-darker" variant="heading2">
                        {formatted}
                    </Heading>
                    <Text color="steel-darker" variant="body">
                        {symbol}
                    </Text>
                </div>
            </div>
        </Card>
    );
}
