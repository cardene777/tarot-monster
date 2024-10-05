import { PhantomWalletName } from "@solana/wallet-adapter-phantom";
import { useWallet } from "@solana/wallet-adapter-react";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { getMetadata } from "../lib/arweave";
// import { createMetaplex } from "../lib/metaplex";
import { EventBus } from "./EventBus";
import { gameDataManager } from "./GameDataManager";
import StartGame from "./main";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { END_POINT } from "../utils/config";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
// import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export const PhaserGame = forwardRef(function PhaserGame(
  { currentActiveScene },
  ref
) {
  const wallet = useWallet();
  wallet.select(PhantomWalletName);
  const umi = createUmi(END_POINT)
    // .use(walletAdapterIdentity(wallet))
    // .use(mplCore())
    .use(mplTokenMetadata())
    // .use(
    //   irysUploader({
    //     address: "https://devnet.irys.xyz",
    //   })
    // );

  const game = useRef();

  const createNFT = async (imgPath, name) => {
    try {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }
      // umi.use(walletAdapterIdentity(wallet));

      const signer = generateSigner(umi);
      umi.use(signerIdentity(signer));

      console.log(`signer: ${signer}`);

      console.log(`imgPath: ${imgPath}`);
      console.log(`name: ${name}`);

      const fileName = imgPath.split("/").pop();

      console.log(`fileName: ${fileName}`);

      const response = await fetch(imgPath);
      const imageFile = await response.arrayBuffer();

      // BlobをUint8Arrayに変換
    //   const arrayBuffer = await imageBlob.arrayBuffer();
    //   const imageFile = new Uint8Array(arrayBuffer);

      const umiImageFile = await createGenericFile(imageFile, fileName, {
        contentType: "image/png",
        tags: [{ name: "Content-Type", value: "image/png" }],
      });
      console.log("umiImageFile contentType:", umiImageFile.contentType);
      console.log("umiImageFile fileName:", umiImageFile.fileName);
      console.log("umiImageFile extension:", umiImageFile.extension);
      console.log(`umiImageFile.tags: ${umiImageFile.tags}`);
    //   console.log("Uploading image...");
    //   const imageUri = await umi.uploader
    //     .upload([umiImageFile], {
    //       onProgress: (progress) => {
    //         console.log(`Upload progress: ${progress}%`);
    //       },
    //     })
    //     .catch((err) => {
    //       throw new Error(`Error uploading image: ${err}`);
    //     });

    //   console.log(`imageUri: ${imageUri}`);

        const metadata = getMetadata("img", name);

        console.log("metadata:", metadata);

      console.log("Uploading metadata...");
      const metadataUri = await umi.uploader
        .uploadJson(metadata)
        .catch((err) => {
          throw new Error(err);
        });

      const ruleset = null; // or set a publicKey from above

      console.log("Creating Nft...");
      const tx = await createProgrammableNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(5.5),
        name: metadata.name,
        uri: metadataUri,
        ruleSet: ruleset,
      }).sendAndConfirm(umi);

      //   const tokenID = await createMetaplex(umi, wallet, metadataUrl);
      //   const url = `https://core.metaplex.com/explorer/${tokenID}?env=devnet`;
    } catch (error) {
      console.error("Error saving JSON to Akord: ", error);
    }
  };

  useLayoutEffect(() => {
    if (game.current === undefined) {
      game.current = StartGame("game-container");
      if (ref !== null) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = undefined;
      }
    };
  }, [ref]);

  useEffect(() => {
    gameDataManager.setData("wallet", wallet);
    gameDataManager.setData("createNFT", createNFT);
  }, [wallet, createNFT]);

  useEffect(() => {
    const handleSceneReady = (currentScene) => {
      if (currentActiveScene instanceof Function) {
        currentActiveScene(currentScene);
      }
      if (ref.current) {
        ref.current.scene = currentScene;
      }
    };

    EventBus.on("current-scene-ready", handleSceneReady);

    return () => {
      EventBus.removeListener("current-scene-ready", handleSceneReady);
    };
  }, [currentActiveScene, ref, wallet]);

  return <div id="game-container"></div>;
});
