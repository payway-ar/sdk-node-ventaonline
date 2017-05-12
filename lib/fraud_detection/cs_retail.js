module.exports = {
    retailData: function(args, items) {
        if (!args.bill) {
            args.bill = 'null'
        }
        if (!args.ship) {
            args.ship = 'null'
        }

        var elements = {};

        product_list(items);

        function product_list(items) {

            Object.keys(items).forEach(function(key) {
                elements[key] = items[key];
            });
        }

        return fraud_detection = {
            send_to_cs: args.send_to_cs,
            channel: args.channel,
            bill_to: {
                city: args.bill.city,
                country: args.bill.country,
                customer_id: args.bill.customer_id,
                email: args.bill.email,
                first_name: args.bill.first_name,
                last_name: args.bill.last_name,
                phone_number: args.bill.phone_number,
                postal_code: args.bill.postal_code,
                state: args.bill.state,
                street1: args.bill.street1,
                street2: args.bill.street2
            },
            purchase_totals: {
                currency: args.currency,
                amount: args.amount
            },
            customer_in_site: {
                days_in_site: args.days_in_site,
                is_guest: args.is_guest,
                password: args.password,
                num_of_transactions: args.num_of_transactions,
                cellphone_number: args.cellphone_number,
                date_of_birth: args.date_of_birth,
                street: args.street
            },
            retail_transaction_data: {
                ship_to: {},
                days_to_delivery: '',
                items: elements
            },
            csmdds: [{
                    code: 17,
                    description: args.MDD17
                },
                {
                    code: 18,
                    description: args.MDD18
                },
                {
                    code: 19,
                    description: args.MDD19
                },
                {
                    code: 20,
                    description: args.MDD20
                },
                {
                    code: 21,
                    description: args.MDD21
                },
                {
                    code: 22,
                    description: args.MDD22
                },
                {
                    code: 23,
                    description: args.MDD23
                },
                {
                    code: 24,
                    description: args.MDD24
                },
                {
                    code: 25,
                    description: args.MDD25
                },
                {
                    code: 26,
                    description: args.MDD26
                },
                {
                    code: 27,
                    description: args.MDD27
                },
                {
                    code: 28,
                    description: args.MDD28
                },
                {
                    code: 29,
                    description: args.MDD29
                },
                {
                    code: 30,
                    description: args.MDD30
                },
                {
                    code: 31,
                    description: args.MDD31
                },
                {
                    code: 32,
                    description: args.MDD32
                },
                {
                    code: 33,
                    description: args.MDD33
                },
                {
                    code: 34,
                    description: args.MDD34
                },
                {
                    code: 43,
                    description: args.MDD43
                },
                {
                    code: 44,
                    description: args.MDD44
                },
                {
                    code: 45,
                    description: args.MDD45
                },
                {
                    code: 46,
                    description: args.MDD46
                },
                {
                    code: 47,
                    description: args.MDD47
                },
                {
                    code: 48,
                    description: args.MDD48
                },
                {
                    code: 49,
                    description: args.MDD49
                },
                {
                    code: 50,
                    description: args.MDD50
                },
                {
                    code: 51,
                    description: args.MDD51
                },
                {
                    code: 52,
                    description: args.MDD52
                },
                {
                    code: 53,
                    description: args.MDD53
                },
                {
                    code: 54,
                    description: args.MDD54
                },
                {
                    code: 55,
                    description: args.MDD55
                },
                {
                    code: 56,
                    description: args.MDD56
                },
                {
                    code: 57,
                    description: args.MDD57
                },
                {
                    code: 58,
                    description: args.MDD58
                },
                {
                    code: 59,
                    description: args.MDD59
                },
                {
                    code: 60,
                    description: args.MDD60
                },
                {
                    code: 61,
                    description: args.MDD61
                },
                {
                    code: 62,
                    description: args.MDD62
                },
                {
                    code: 63,
                    description: args.MDD63
                },
                {
                    code: 64,
                    description: args.MDD64
                },
                {
                    code: 65,
                    description: args.MDD65
                },
                {
                    code: 66,
                    description: args.MDD66
                },
                {
                    code: 67,
                    description: args.MDD67
                },
                {
                    code: 68,
                    description: args.MDD68
                },
                {
                    code: 69,
                    description: args.MDD69
                },
                {
                    code: 70,
                    description: args.MDD70
                },
                {
                    code: 71,
                    description: args.MDD71
                },
                {
                    code: 72,
                    description: args.MDD72
                },
                {
                    code: 73,
                    description: args.MDD73
                },
                {
                    code: 74,
                    description: args.MDD74
                },
                {
                    code: 75,
                    description: args.MDD75
                },
                {
                    code: 76,
                    description: args.MDD76
                },
                {
                    code: 77,
                    description: args.MDD77
                },
                {
                    code: 78,
                    description: args.MDD78
                },
                {
                    code: 79,
                    description: args.MDD79
                },
                {
                    code: 80,
                    description: args.MDD80
                },
                {
                    code: 81,
                    description: args.MDD81
                },
                {
                    code: 82,
                    description: args.MDD82
                },
                {
                    code: 83,
                    description: args.MDD83
                },
                {
                    code: 84,
                    description: args.MDD84
                },
                {
                    code: 85,
                    description: args.MDD85
                },
                {
                    code: 86,
                    description: args.MDD86
                },
                {
                    code: 87,
                    description: args.MDD87
                },
                {
                    code: 88,
                    description: args.MDD88
                },
                {
                    code: 89,
                    description: args.MDD89
                },
                {
                    code: 90,
                    description: args.MDD90
                },
                {
                    code: 91,
                    description: args.MDD91
                },
                {
                    code: 92,
                    description: args.MDD92
                },
                {
                    code: 93,
                    description: args.MDD93
                },
                {
                    code: 94,
                    description: args.MDD94
                },
                {
                    code: 95,
                    description: args.MDD95
                },
                {
                    code: 96,
                    description: args.MDD96
                },
                {
                    code: 97,
                    description: args.MDD97
                },
                {
                    code: 98,
                    description: args.MDD98
                },
                {
                    code: 99,
                    description: args.MDD99
                },
                {
                    code: 100,
                    description: args.MDD100
                },
            ],
        }
    }
}
