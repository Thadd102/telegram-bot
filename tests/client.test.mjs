import test from "node:test";
import * as assert from "node:assert/strict";
import { rpc } from "@stellar/stellar-sdk";

import { verifyNetwork } from "../dist/stellar/client.js";
import { startMockRpc } from "../dist/stellar/mock-rpc.js";
import { MOCK_NETWORK_PASSPHRASE } from "../dist/stellar/mock-constants.js";

test("client.js network passphrase verification", async (t) => {
  await t.test("accepts matching passphrase", async () => {
    const mock = await startMockRpc();
    const server = new rpc.Server(mock.url, { allowHttp: true });

    const config = { networkPassphrase: MOCK_NETWORK_PASSPHRASE };
    await assert.doesNotReject(verifyNetwork(server, config));

    await mock.close();
  });

  await t.test("rejects mismatched passphrase", async () => {
    const mock = await startMockRpc();
    const server = new rpc.Server(mock.url, { allowHttp: true });

    const config = { networkPassphrase: "Wrong Passphrase" };
    await assert.rejects(
      verifyNetwork(server, config),
      /Network passphrase mismatch/
    );

    await mock.close();
  });
});
