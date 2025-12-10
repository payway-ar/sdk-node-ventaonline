const PROJECT_PREFIX = '[SDK Node.js - Payway]';

//Endpoints v2
const ENDPOINT_DEV_V2 = "http://decidir.payway-dev.tanzu.intra/api/v2";
const ENDPOINT_QA_V2 = "http://decidir.payway-qa.tanzu.intra/api/v2";
const ENDPOINT_SANDBOX_V2 = "https://developers.decidir.com/api/v2";
const ENDPOINT_PRD_V2 = "https://ventasonline.payway.com.ar/api/v2";

//Endpoints checkout v2
const ENDPOINT_CHECKOUT_DEV_V2 = "http://decidir.payway-dev.tanzu.intra/api/v1/checkout-payment-button";
const ENDPOINT_CHECKOUT_QA_V2 = "http://decidir.payway-qa.tanzu.intra/api/v1/checkout-payment-button";
const ENDPOINT_CHECKOUT_SANDBOX_V2 = "https://developers.decidir.com/api/v1/checkout-payment-button";
const ENDPOINT_CHECKOUT_PRD_V2 = "https://live.decidir.com/api/v1/checkout-payment-button";

// Endpoints v1
const ENDPOINT_DEV_V1 = "http://decidir.payway-dev.tanzu.intra/api/v1";
const ENDPOINT_QA_V1 = "http://decidir.payway-qa.tanzu.intra/api/v1";
const ENDPOINT_SANDBOX_V1 = "https://developers.decidir.com/api/v1";
const ENDPOINT_PRD_V1 = "https://ventasonline.payway.com.ar/api/v1";


module.exports = {
    PROJECT_PREFIX,
    ENDPOINT_SANDBOX_V2,
    ENDPOINT_DEV_V2,
    ENDPOINT_QA_V2,
    ENDPOINT_PRD_V2,
    ENDPOINT_QA_V1,
    ENDPOINT_DEV_V1,
    ENDPOINT_SANDBOX_V1,
    ENDPOINT_PRD_V1,
    ENDPOINT_CHECKOUT_DEV_V2,
    ENDPOINT_CHECKOUT_QA_V2,
    ENDPOINT_CHECKOUT_SANDBOX_V2,
    ENDPOINT_CHECKOUT_PRD_V2,
}
