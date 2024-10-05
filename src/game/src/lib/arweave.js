import { generateImgURI } from "./timestamp";

const getRandomValue = () => {
  return Math.floor(Math.random() * 10) + 1;
};

export const getMetadata = (imageUri, name) => {
  const nftMetadata = {
    name: `Tarot Monster ${name}`,
    symbol: "TMNFT",
    description: "Tarot Monster NFT",
    image: imageUri,
    attributes: [
      {
        trait_type: "Level",
        value: 0,
      },
      {
        trait_type: "Attack",
        value: getRandomValue(),
      },
      {
        trait_type: "Defense",
        value: getRandomValue(),
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri,
          type: "image/png",
        },
      ],
      category: "image",
    },
  };

  return nftMetadata;
};
