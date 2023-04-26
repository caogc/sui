// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { scaleTime, scaleLinear } from '@visx/scale';
import { curveLinear } from '@visx/curve';
import { AxisBottom } from '@visx/axis';
import { LinePath } from '@visx/shape';
import { useMemo } from 'react';

import { type EpochGasInfo } from './types';

function formatDate(date: Date) {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
}

function isDefined(d: EpochGasInfo) {
    return d.date !== null && d.referenceGasPrice !== null;
}

const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24;

export type GraphProps = {
    data: EpochGasInfo[];
    width: number;
    height: number;
    durationDays: number;
};
export function Graph({ data, width, height, durationDays }: GraphProps) {
    const graphTop = 0;
    const graphButton = height - 20;
    const xScale = useMemo(() => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        const minDate = new Date(today);
        minDate.setTime(
            minDate.getTime() - (durationDays - 1) * ONE_DAY_MILLIS
        );
        const minGraphDate = Math.min(
            ...data.filter(isDefined).map(({ date }) => date!.getTime())
        );
        return scaleTime<number>({
            domain: [
                new Date(Math.min(minDate.getTime(), minGraphDate)),
                today,
            ],
            nice: 'day',
            range: [30, width - 30],
        });
    }, [durationDays, width]);
    const yScale = useMemo(() => {
        const prices = [
            ...data
                .filter(isDefined)
                .map(({ referenceGasPrice }) => Number(referenceGasPrice!)),
        ];
        return scaleLinear<number>({
            domain: [Math.min(...prices), Math.max(...prices)],
            range: [graphTop, graphButton],
        });
    }, [data, graphTop, graphButton]);
    return (
        <svg
            width={width}
            height={height}
            className="stroke-steel-dark/80 transition hover:stroke-hero"
        >
            <LinePath<EpochGasInfo>
                curve={curveLinear}
                data={data}
                x={(d) => xScale(d.date!.getTime())}
                y={(d) => yScale(Number(d.referenceGasPrice!))}
                width="1"
                markerMid="url(#marker-circle)"
                markerStart="url(#marker-circle)"
                markerEnd="url(#marker-circle)"
                defined={isDefined}
            />
            <AxisBottom
                top={height - 30}
                orientation="bottom"
                tickLabelProps={{
                    fontFamily: '',
                    fontSize: '',
                    className: 'text-subtitle font-medium',
                }}
                scale={xScale}
                tickFormat={formatDate}
                hideTicks
                hideAxisLine
                numTicks={Math.min(durationDays, 15)}
            />
        </svg>
    );
}
