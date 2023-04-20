export {};

// import { Heading } from '_src/ui/app/shared/heading';
// import { Text } from '_src/ui/app/shared/text';
// import { ObjectChanges } from './cards/ObjectChanges';
// import React, { ReactNode } from 'react';

// type SummarySectionTypes = 'balanceChange' | 'transfer' | 'objectChanges';

// type SummarySection = {
//     heading: string;
//     subtitle?: string;
//     type: SummarySectionTypes;
// };

// interface SummaryProps {
//     sections: SummarySection[];
// }

// type SummaryComponent = React.FC<SummaryProps>;

// const SummarySectionLookup: Record<SummarySectionTypes, SummaryComponent> = {
//     objectChanges: ObjectChanges,
// };

// export const Summary = ({ sections }: SummaryProps) => {
//     return (
//         <div className="flex flex-col gap-4">
//             {sections.map(({ heading, subtitle, type }) => {
//                 return (
//                     <div className="bg-white relative flex flex-col p-4.5 shadow-summary-card rounded-2xl">
//                         <div></div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
