function generateCsmdds(vertical) {
    const defaultRanges = [{ start: 17, end: 34 }, { start: 43, end: 99 }];
    const verticalRanges = {
        ticketing_transaction_data: [{ start: 12, end: 12 }, { start: 14, end: 31 }, { start: 33, end: 33 },  { start: 43, end: 99 }],
    };

    const ranges = verticalRanges[vertical] || defaultRanges;

    return ranges.flatMap(({ start, end }) =>
        Array.from({ length: end - start + 1 }, (_, i) => ({
            code: start + i,
            description: `Campo MDD${start + i}`
        }))
    );
}

module.exports = {
    generateCsmdds
};
