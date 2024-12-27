const FRAUD_DETECTION_ERRORS = {
    MISSING_ARGS: "El parámetro 'args' es obligatorio.",
    MISSING_CHANNEL: "El campo 'channel' en 'args' es obligatorio.",
    MISSING_CURRENCY: "El campo 'currency' en 'args' es obligatorio.",
    MISSING_AMOUNT: "El campo 'amount' en 'args' es obligatorio.",
    MISSING_SHIP_TO: "El campo 'ship_to' es obligatorio.",
    MISSING_FIELD: "El campo '{field}' es obligatorio."
};

const REQUIRED_FIELDS = {
    bill_to: [
        "city", "country", "customer_id", "email",
        "first_name", "last_name", "phone_number",
        "postal_code", "state", "street1"
    ],
    purchase_totals: [
        "currency", "amount"
    ],
    ship_to: [
        "city", "country", "email", "first_name",
        "last_name", "phone_number", "postal_code",
        "state", "street1"
    ]
};

function validateFraudDetectionArgs(args, verticalName) {
    if (!args) {
        throw new Error(FRAUD_DETECTION_ERRORS.MISSING_ARGS);
    }

    if (!args[verticalName]) {
        throw new Error(FRAUD_DETECTION_ERRORS.MISSING_FIELD.replace("{field}", `${verticalName}`));
    }

    if (!args[verticalName].ship_to) {
        throw new Error(FRAUD_DETECTION_ERRORS.MISSING_SHIP_TO);
    }

    if (!args.channel) {
        throw new Error(FRAUD_DETECTION_ERRORS.MISSING_CHANNEL);
    }

    // Validate required fields for BillTo
    REQUIRED_FIELDS.bill_to.forEach(field => {
        if (!args.bill_to || !args.bill_to[field]) {
            throw new Error(FRAUD_DETECTION_ERRORS.MISSING_FIELD.replace("{field}", `bill_to.${field}`));
        }
    });

    // Validate required fields for PurchaseTotals
    REQUIRED_FIELDS.purchase_totals.forEach(field => {
        if (!args.purchase_totals || !args.purchase_totals[field]) {
            throw new Error(FRAUD_DETECTION_ERRORS.MISSING_FIELD.replace("{field}", `purchase_totals.${field}`));
        }
    });

    // Validate required fields for ShipTo
    REQUIRED_FIELDS.ship_to.forEach(field => {
        if (!args[verticalName].ship_to || !args[verticalName].ship_to[field]) {
            throw new Error(FRAUD_DETECTION_ERRORS.MISSING_FIELD.replace("{field}", `ship_to.${field}`));
        }
    });
}

function generateCsmdds(index, rangeEnd = 34, vertical = 'retail') {
    const ranges = [
        { start: index, end: rangeEnd },
        { start: 43, end: 99 },
    ];
    
    let result = ranges.flatMap(({ start, end }) => 
        Array.from({ length: end - start + 1 }, (_, i) => {
            const code = start + i;
            return { code, description: `Campo MDD${code}` };
        })
    );

    if (vertical === 'ticketing') {
        result = result.filter(item => item.code !== 13);
    }

    return result;
}

module.exports = {
    generateCsmdds,
    validateFraudDetectionArgs,
};
