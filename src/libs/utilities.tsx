"use client";

import { parse } from "csv-parse";
import { getTokenBalance } from "./zetrix";

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function processCSV(csvData: string): Promise<RecipientInfo[]> {
  return new Promise((resolve, reject) => {
    parse(csvData, { columns: true, trim: true }, (err, records) => {
      if (err) {
        return reject(`Error parsing CSV: ${err.message}`);
      }

      // Check if the first row contains the exact expected column headers
      const expectedHeaders = [
        "Recipient - Zetrix Account Address",
        "Amount - Amount in smallest unit of the token to be sent",
      ];

      const actualHeaders = Object.keys(records[0] || {});

      if (actualHeaders.length !== expectedHeaders.length || !actualHeaders.every((header, i) => header === expectedHeaders[i])) {
        return reject(`Invalid CSV headers. Expected exact column headers: ${expectedHeaders.join(", ")}`);
      }

      // Process rows and check for empty values
      const recipientsInfo = records.map((record: any, index: number) => {
        const recipient = record["Recipient - Zetrix Account Address"];
        const amount = record["Amount - Amount in smallest unit of the token to be sent"];

        // Validate each row: no empty recipient or amount
        if (!recipient || !amount) {
          reject(`Missing data on row ${index + 1}. Both "Recipient" and "Amount" must be provided.`);
        }

        return {
          recipient,
          amount,
        };
      });

      resolve(recipientsInfo);
    });
  });
}

export function processZTP1155CSV(csvData: string): Promise<{ recipientsInfo: RecipientInfo[], uniqueTokenIDs: string[] }> {
  return new Promise((resolve, reject) => {
    parse(csvData, { columns: true, trim: true }, (err, records) => {
      if (err) {
        return reject(`Error parsing CSV: ${err.message}`);
      }

      // Check if the first row contains the exact expected column headers
      const expectedHeaders = [
        "Recipient - Zetrix Account Address",
        "Amount - Amount in smallest unit of the token to be sent",
        "Token ID – Token ID of the ZTP1155 token"
      ];

      const actualHeaders = Object.keys(records[0] || {});

      if (actualHeaders.length !== expectedHeaders.length || !actualHeaders.every((header, i) => header === expectedHeaders[i])) {
        return reject(`Invalid CSV headers. Expected exact column headers: ${expectedHeaders.join(", ")}`);
      }

      const uniqueTokenIDsSet = new Set<string>();

      // Process rows and check for empty values
      const recipientsInfo = records.map((record: any, index: number) => {
        const recipient = record["Recipient - Zetrix Account Address"];
        const amount = record["Amount - Amount in smallest unit of the token to be sent"];
        const tokenId = record["Token ID – Token ID of the ZTP1155 token"];

        // Validate each row: no empty recipient or amount
        if (!recipient || !amount || !tokenId) {
          reject(`Missing data on row ${index + 1}. Recipient, amount and token ID must be provided.`);
        }

        uniqueTokenIDsSet.add(tokenId);

        return {
          recipient,
          amount,
          tokenId
        };
      });

      const uniqueTokenIDs = Array.from(uniqueTokenIDsSet);

      resolve({ recipientsInfo, uniqueTokenIDs });
    });
  });
}

export async function ztp1155AllowanceCheck(txInitiator: string, recipientsInfo: RecipientInfo[], ztpContractAddress: string): Promise<string[]> {
  const groupedRecipients = groupByTokenId(recipientsInfo);
  let tokenShortage: string[] = [];

  await Promise.all(
    groupedRecipients.map(async ({ tokenId, totalAmount }) => {
      let { result, error } = await getTokenBalance(ztpContractAddress, txInitiator, tokenId);

      if (result !== 0) {
        if (result < totalAmount) {
          tokenShortage.push(tokenId);
        }
      }
    })
  );

  return tokenShortage;
}

function groupByTokenId(recipientsInfo: RecipientInfo[]): RecipientGroup[] {
  const groups: Record<string, RecipientGroup> = {};

  recipientsInfo.forEach(recipient => {
    const tokenId = recipient.tokenId!;

    if (!groups[tokenId]) {
      groups[tokenId] = {
        tokenId: tokenId,
        recipients: [],
        totalAmount: 0
      };
    }
    groups[tokenId].recipients.push(recipient.recipient);
    groups[tokenId].totalAmount += parseFloat(recipient.amount);
  });

  return Object.values(groups);
}

export function isMobileCheck(): boolean {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    return /android|iPad|iPhone|iPod/i.test(userAgent.toLowerCase());
  }
  return false;
}

export function isChromeCheck() {
  // detect browser; NOTE: navigator.userAgent will detect microsoft edge as chrome
  return (
    /Chrome/.test(navigator.userAgent) &&
    !/Edge|Edg|EdgiOS/.test(navigator.userAgent)
  );
}
