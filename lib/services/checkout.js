var Client = require('node-rest-client').Client;
const functions = require('../utils/functions');

module.exports = {
  checkoutHash: (endpoint, args, callback, grouper, developer) => {
    client = new Client();

    args = {
        data: {
            "id": args.id,
            "origin_platform": args.origin_platform,
            "payment_description": args.payment_description,
            "products": args.products,
            "total_price": args.total_price,
            "site": args.site,
            "success_url": args.success_url,
            "redirect_url": args.redirect_url,
            "cancel_url": args.cancel_url,
            "notifications_url": args.notifications_url,
            "life_time": args.life_time,
            "template_id": args.template_id,
            "installments": args.installments,
            "id_payment_method": args.id_payment_method,
            "plan_gobierno": args.plan_gobierno
        },

      headers: {
        'Content-Type': "application/json",
        'X-Source': functions.generateXsourceHeader(grouper, developer)
      }
    };

    client.post(endpoint + "/payments/link", args, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}