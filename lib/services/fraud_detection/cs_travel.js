const logger = require('../../utils/logger');
module.exports = {
    generateTravelData: function (args) {

        args.bill = args.bill || {};

        const passengerList = () => {
            return [...args.travel_transaction_data.passengers];
        };

        const fraudDetection = {
            send_to_cs: args.send_to_cs || null,
            channel: args.channel || null,
            dispatch_method: args.dispatch_method || null,
            device_unique_id: args.device_unique_id,
            bill_to: {
                city: args.bill_to?.city || null,
                country: args.bill_to?.country || null,
                customer_id: args.bill_to?.customer_id || null,
                email: args.bill_to?.email || null,
                first_name: args.bill_to?.first_name || null,
                last_name: args.bill_to?.last_name || null,
                phone_number: args.bill_to?.phone_number || null,
                postal_code: args.bill_to?.postal_code || null,
                state: args.bill_to?.state || null,
                street1: args.bill_to?.street1 || null,
                street2: args.bill_to?.street2 || null,
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
            },
            travel_transaction_data: {
                reservation_code: args.travel_transaction_data.reservation_code,
                third_party_booking: args.travel_transaction_data.third_party_booking,
                departure_city: args.travel_transaction_data.departure_city,
                final_destination_city: args.travel_transaction_data.final_destination_city,
                international_flight: args.travel_transaction_data.international_flight,
                frequent_flier_number: args.travel_transaction_data.frequent_flier_number,
                class_of_service: args.travel_transaction_data.class_of_service,
                day_of_week_of_flight: args.travel_transaction_data.day_of_week_of_flight,
                week_of_year_of_flight: args.travel_transaction_data.week_of_year_of_flight,
                airline_code: args.travel_transaction_data.airline_code,
                code_share: args.travel_transaction_data.code_share,
                decision_manager_travel: args.travel_transaction_data.decision_manager_travel,
                passengers: passengerList(),
                airline_number_of_passengers:args.travel_transaction_data.airline_number_of_passengers,
            },            
        };

        logger.info('Fraud detection data generated: ' + JSON.stringify(fraudDetection));

        return fraudDetection;
    },
};
