const functions = require('../../utils/fraudDetectionUtils');

module.exports = {
    generateRetailData: function (args) {

        const VERTICAL_FIELD_NAME = 'retail_transaction_data';
        const INDEX_CSMDDS_RETAIL = 17;

        utils.validateFraudDetectionArgs(args, VERTICAL_FIELD_NAME);

        args.bill = args.bill || {};
        args.ship = args.ship || {};

        const productList = () => {
            return [...args.retail_transaction_data.items];
        };

        const fraudDetection = {
            send_to_cs: args.send_to_cs || null,
            channel: args.channel,
            bill_to: {
                city: args.bill_to.city || null,
                country: args.bill_to.country || null,
                customer_id: args.bill_to.customer_id || null,
                email: args.bill_to.email || null,
                first_name: args.bill_to.first_name || null,
                last_name: args.bill_to.last_name || null,
                phone_number: args.bill_to.phone_number || null,
                postal_code: args.bill_to.postal_code || null,
                state: args.bill_to.state || null,
                street1: args.bill_to.street1 || null,
                street2: args.bill_to.street2 || null,
            },
            purchase_totals: {
                currency: args.purchase_totals.currency,
                amount: args.purchase_totals.amount,
            },
            customer_in_site: {
                days_in_site: args.customer_in_site.days_in_site || null,
                is_guest: args.customer_in_site.is_guest || false,
                password: args.customer_in_site.password || null,
                num_of_transactions: args.customer_in_site.num_of_transactions || 0,
                cellphone_number: args.customer_in_site.cellphone_number || null,
                date_of_birth: args.customer_in_site.date_of_birth || null,
                street: args.customer_in_site.street || null,
            },
            retail_transaction_data: {
                ship_to: {
                    city: args.retail_transaction_data.ship_to.city,
                    country: args.retail_transaction_data.ship_to.country,
                    email: args.retail_transaction_data.ship_to.email,
                    first_name: args.retail_transaction_data.ship_to.first_name,
                    last_name: args.retail_transaction_data.ship_to.last_name,
                    phone_number: args.retail_transaction_data.ship_to.phone_number,
                    postal_code: args.retail_transaction_data.ship_to.postal_code,
                    state: args.retail_transaction_data.ship_to.state,
                    street1: args.retail_transaction_data.ship_to.street1,
                    street2: args.retail_transaction_data.ship_to.street2
                },
                account: {
                    id: args.retail_transaction_data.account.id,
                    name: args.retail_transaction_data.account.name,
                    category: args.retail_transaction_data.account.category,
                    antiquity: args.retail_transaction_data.account.antiquity,
                    type: args.retail_transaction_data.account.type,
                },
                wallet_account: {
                    id: args.retail_transaction_data.wallet_account.id,
                    antiquity: args.retail_transaction_data.wallet_account.antiquity
                },
                enroled_card_quantity: args.retail_transaction_data.enroled_card_quantity,
                payment_method_risk_level: args.retail_transaction_data.payment_method_risk_level,
                dispatch_method : args.retail_transaction_data.dispatch_method,
                double_factor_tp: args.retail_transaction_data.double_factor_tp,
                days_to_delivery: args.retail_transaction_data.days_to_delivery || '',
                tax_voucher_required: args.retail_transaction_data.tax_voucher_required || false,
                customer_loyality_number: args.retail_transaction_data.customer_loyality_number || '',
                coupon_code: args.retail_transaction_data.coupon_code || '',
                items: productList()
            },
            csmdds: utils.generateCsmdds(INDEX_CSMDDS_RETAIL),
        };

        console.log("fraudDetection: " + JSON.stringify(fraudDetection));

        return fraudDetection;
    },
};
