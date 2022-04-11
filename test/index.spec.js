let subject = require("../src/index");
let fs = require("fs");
const path = require("path");

let exampleDist = path.join(__dirname, "../example/dist");
let exampleTmpl = path.join(__dirname, "../example/s.yaml");
let outputDir = path.join(__dirname, "../src/code/public");

test('props.function.codeUri not present', async function () {
    let result = await subject({}, {});
    expect(result).toBeUndefined();
});

test('path.configPath not present', async function () {
    let catchTriggered = false;
    try {
        await subject({
            props: {
                function: {
                    codeUri: exampleDist
                }
            }
        }, {});
    } catch (e) {
        expect(e.code).toBe("ERR_INVALID_ARG_TYPE");
        expect(e.message.toString().includes("The \"path\" argument must be of type string.")).toBeTruthy();
        catchTriggered = true;
    }
    expect(catchTriggered).toBeTruthy();
});




