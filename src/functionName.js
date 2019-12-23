import { corsHeaders } from "./configuration";

export const handler = async function (event, context) {
    console.log('I Ran!');

    return {
        headers: corsHeaders,
        body: {"cake": "good"}
    };
};

export default {};