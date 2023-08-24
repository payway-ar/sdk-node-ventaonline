//Quedaron hardcodeadas en form-tokenpago.html y ejemplo_form.ejs
const PUBLIC_API_KEY = "YKcWXjI2aoSnp60urwLd6TbLYNuybcWC";
const PRIVATE_API_KEY = "ScPLmMRUt1ivVJxQxZ6508s30I9jeXx7";
const ENDPOINT_DEVELOPER = "https://developers.decidir.com/api/v2";
const ENDPOINT_QA = "https://qa.decidir.com/api/v2";

//Endpoints v2
const ENDPOINT_DEV_V2 = "https://developers.decidir.com/api/v2";
const ENDPOINT_QA_V2 = "https://qa.decidir.com/api/v2";
const ENDPOINT_PRD_V2 = "https://live.decidir.com/api/v2";

//Endpoints checkout v2
const ENDPOINT_CHECKOUT_DEV_V2 = "https://dev.decidir.com/api/orchestrator/checkout/payments/link";
const ENDPOINT_CHECKOUT_QA_V2 = "https://qa.decidir.com/api/orchestrator/checkout";
const ENDPOINT_CHECKOUT_PRD_V2 = "https://live.decidir.com/api/checkout/payments";

// Endpoints v1
const ENDPOINT_QA_V1 = "https://qa.decidir.com/api/v1";
const ENDPOINT_DEV_V1 = "https://dev.decidir.com/api/v1";
const ENDPOINT_PRD_V1 = "https://live.decidir.com/api/v1";


module.exports = {
    PUBLIC_API_KEY,
    PRIVATE_API_KEY,
    ENDPOINT_DEVELOPER,
    ENDPOINT_QA,
    ENDPOINT_DEV_V2,
    ENDPOINT_QA_V2,
    ENDPOINT_PRD_V2,
    ENDPOINT_QA_V1,
    ENDPOINT_DEV_V1,
    ENDPOINT_PRD_V1,
    ENDPOINT_CHECKOUT_DEV_V2,
    ENDPOINT_CHECKOUT_QA_V2,
    ENDPOINT_CHECKOUT_PRD_V2,
}