import { BalanceChanges } from './cards/BalanceChanges';
import { ObjectChanges } from './cards/ObjectChanges';
// import { TotalAmount } from './cards/TotalAmount';
// import { TotalAmount } from './cards/TotalAmount';
import { type DryRunTransactionSummary } from './useTransactionSummary';

export function TransactionSummary({
    summary,
}: {
    summary?: DryRunTransactionSummary | null;
}) {
    return summary ? (
        <div className="flex flex-col gap-4">
            {/* <TotalAmount
                amount={summary?.amount?.total}
                coinType={summary?.amount?.coinType}
            /> */}
            <BalanceChanges changes={summary.balanceChanges} />
            <ObjectChanges summary={summary.objectSummary} />
        </div>
    ) : null;
}
