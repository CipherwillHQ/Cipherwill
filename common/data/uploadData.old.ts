// export default async function upload_pod_data({
//   data_items,
//   client,
// }: {
//   data_items: DataItem[];
//   client: ApolloClient<any>;
// }) {
//   let items = data_items;
//   for await (const item of items) {
//     logger.info("Uploading data pod", item);
//     const random_key = crypto.randomBytes(24).toString("hex"); // 16 bytes for IV and 32 bytes for key = 48 bytes random key
//     logger.info("Random key generated", random_key);
//     let file;
//     if (typeof item.data === "string") {
//       const file_data = AES.encrypt(item.data, random_key).toString();
//       file = new Blob([file_data], { type: "text/plain" });
//     } else {
//       const cipher = crypto.createCipheriv(
//         "aes-256-cbc",
//         random_key.slice(16),
//         random_key.slice(0, 16)
//       );
//       const encrypted = Buffer.concat([
//         cipher.update(
//           new Uint8Array(
//             await item.data.arrayBuffer() // binary
//           ) // 8 bit unsigned integer
//         ),
//         cipher.final(),
//       ]);
//       file = new Blob([encrypted], { type: "data/encrypted" });
//       console.log("being uploaded", file);
//     }
//     await client.mutate({
//       mutation: UPDATE_POD,
//       variables: {
//         data_model_version: item.data_model_version,
//         ref_id: item.ref_id,
//         file,
//       },
//       context: {
//         headers: {
//           "apollo-require-preflight": true,
//         },
//       },
//     });
//     // replacing original data with random key for data access
//     item.data = random_key;
//   }
//   const all_items = [];

//   // get beneficiary factors
//   const beneficiary_factors = await client.query({
//     query: GET_BENEFICIARY_FACTORS,
//   });

//   // get all beneficiary factors
//   const all_beneficiary_factors =
//     beneficiary_factors.data.getBeneficiaryFactors;

//   for await (const beneficiary_factor of all_beneficiary_factors) {
//     const public_key_of_beneficiary_data = beneficiary_factor.publicKey;

//     if (beneficiary_factor.factors.length === 0) {
//       for await (const item of items) {
//         all_items.push({
//           beneficiary_id: beneficiary_factor.beneficiary_id,
//           ref_id: item.ref_id,
//           publicKey: "null",
//           key: await encrypt_for_key(item.data, public_key_of_beneficiary_data),
//         });
//       }
//     } else {
//       for await (const factor of beneficiary_factor.factors) {
//         for await (const item of items) {
//           all_items.push({
//             beneficiary_id: beneficiary_factor.beneficiary_id,
//             ref_id: item.ref_id,
//             publicKey: factor.publicKey,
//             key: await encrypt(
//               factor.publicKey,
//               Buffer.from(
//                 await encrypt_for_key(item.data, public_key_of_beneficiary_data)
//               )
//             ),
//           });
//         }
//       }
//     }
//   }

//   // get all own factors
//   const factors = await client.query({
//     query: GET_FACTORS,
//   });

//   const all_factors = factors.data.getFactors;

//   if (all_factors.length === 0) {
//     // upload without encryption with no public key

//     for await (const item of items) {
//       all_items.push({
//         ref_id: item.ref_id,
//         publicKey: item.publicKey,
//         key: item.data,
//       });
//     }
//   } else {
//     // encrypt each factor
//     for await (const factor of all_factors) {
//       for await (const item of items) {
//         all_items.push({
//           ref_id: item.ref_id,
//           publicKey: factor.publicKey,
//           key: await encrypt_for_key(item.data, factor.publicKey),
//         });
//       }
//     }
//   }

//   // upload encrypted factors
//   await recurring_upload(client, all_items);
// }
