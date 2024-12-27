const utils = require('../../utils/fraudDetectionUtils');
const logger = require('../../utils/logger');

module.exports = {
    generateTicketingData: function (args) {

        // const VERTICAL_FIELD_NAME = 'ticketing_transaction_data';
        const INDEX_CSMDDS_TICKETING = 12;
        const END_CSMDDS_TICKETING = 32;
        const VERTICAL = "ticketing";

        // utils.validateFraudDetectionArgs(args, VERTICAL_FIELD_NAME);

        const itemList = () => {
            return [...args.ticketing_transaction_data.items];
        };
        let csmddsArray = utils.generateCsmdds(INDEX_CSMDDS_TICKETING, END_CSMDDS_TICKETING, VERTICAL); 

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
            ticketing_transaction_data: {
                days_to_event: args.ticketing_transaction_data.days_to_event,
                delivery_type: args.ticketing_transaction_data.delivery_type,
                items: itemList()
            },
            csmdds: csmddsArray,
        };

        logger.info('Fraud detection data generated: ' + JSON.stringify(fraudDetection));

        return fraudDetection;
    },
};