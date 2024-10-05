import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCore,
  createV1,
  fetchAsset,
  addPlugin,
  updatePlugin,
} from "@metaplex-foundation/mpl-core";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { END_POINT } from "../utils/config";

// const umi = createUmi(END_POINT).use(mplCore());

const getRandomValue = () => {
  return Math.floor(Math.random() * 10) + 1;
};

export const createMetaplex = async (umi, wallet, uri) => {
  umi.use(walletAdapterIdentity(wallet));

  const asset = generateSigner(umi);

  const metadata = {
    asset,
    name: "Tarot Monster",
    uri,
  };

  await createV1(umi, metadata).sendAndConfirm(umi);

  console.log("asset =>", asset.publicKey.toString());

  const assets = publicKey(asset.publicKey.toString());

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: "Attributes",
      attributeList: [
        { key: "Level", value: "1" },
        { key: "Attack", value: getRandomValue().toString() },
        { key: "Defense", value: getRandomValue().toString() },
      ],
    },
  }).sendAndConfirm(umi);

  return asset.publicKey.toString();
};

export const getNFTMetadata = async (tokenID) => {
  const asset = await fetchAsset(umi, tokenID, {
    skipDerivePlugins: false,
  });

  return asset;
};

export const updateAttributes = async (umi, tokenID) => {
  await updatePlugin(umi, {
    asset: tokenID,
    plugin: {
      type: "Attributes",
      attributeList: [
        { key: "Level", value: "1" },
        { key: "Point", value: "0" },
        { key: "Attack", value: getRandomValue().toString() },
        { key: "Defense", value: getRandomValue().toString() },
        { key: "HP", value: getRandomValue().toString() },
      ],
    },
  }).sendAndConfirm(umi);
};
