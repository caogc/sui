import { type TransactionSummary as TransactionSummaryType } from '@mysten/core';

import { BalanceChanges } from './cards/BalanceChanges';
import { ExplorerLinkCard } from './cards/ExplorerLink';
import { GasSummary } from './cards/GasSummary';
import { ObjectChanges } from './cards/ObjectChanges';
// import { TotalAmount } from './cards/TotalAmount';

export function TransactionSummary({
    summary,
}: {
    summary?: TransactionSummaryType | null;
}) {
    if (!summary) return null;
    return (
        <div className="flex flex-col gap-4">
            {/* <TotalAmount
                amount={summary?.amount?.total}
                coinType={summary?.amount?.coinType}
            /> */}
            <BalanceChanges changes={summary.balanceChanges} />
            <ObjectChanges changes={summary.objectSummary} />
            <GasSummary gasSummary={summary?.gas} />
            <ExplorerLinkCard
                digest={summary?.digest}
                timestamp={summary?.timestamp}
            />
        </div>
    );
}
