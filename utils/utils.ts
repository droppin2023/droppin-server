import { Contract, providers } from "ethers";
import { BADGE_FACET_ABI, CORE_FACET_ABI } from "./abis";
import { DIAMOND_ADDRESS } from "./addresses";

function getTimestamp() {
  return Math.floor(+new Date() / 1000);
}

async function awaitAndFilter(requests: any[]) {
  let result = (await Promise.allSettled(requests))
    .filter((res) => res.status === "fulfilled")
    .map((res: any) => res.value);
  return result;
}

const contracts = {
  core: new Contract(DIAMOND_ADDRESS, CORE_FACET_ABI),
  badge: new Contract(DIAMOND_ADDRESS, BADGE_FACET_ABI),
}
const provider = new providers.JsonRpcProvider(process.env.LOCALHOST_RPC);

const parseReceipt: any = async (
  transactionHash: string,
  eventName: string,
  contract: Contract
) => {
  let targetEvent;
  const receipt = await provider.getTransactionReceipt(transactionHash);
  // console.log(receipt);
  for (const event of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(event);
      if (parsedLog && parsedLog.name === eventName) {
        targetEvent = parsedLog;
        break;
      }
    } catch (e) {}
  }
  return targetEvent?.args;
};

export { getTimestamp, awaitAndFilter, contracts, parseReceipt };
