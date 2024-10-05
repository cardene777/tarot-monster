export const loadImage = (scene, images) => {
  images.forEach(({ key, path }) => {
    scene.load.image(key, path);
  });
}

export const loadSelectedImages = (scene, images) => {
  images.forEach((card) => {
    scene.load.image(`card-${card.id}`, card.image);
  });
}

export const loadCharacterImages = (scene, assetsPath) => {
  for (let i = 1; i <= 5; i++) {
    scene.load.image(
      `character${i}`,
      `${assetsPath}/characters/character${i}.png`
    );
  }
};
