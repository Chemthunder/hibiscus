namespace recievers {
    let proceed = false;
    export function register() {
        try {
            proceed = true;
        } catch {
            throw game.reset();
        }

        if (proceed) {
            gameScript.bootstrap();
        } else {
            game.reset();
        }

        if (hyacinth.isDevelopmentEnvironment(true)) {
            console.log(proceed + ": game ready.");
        }
    }
}

namespace gameAssets {
    export let playerImage = img`
        f f f f f f
        f f f f f f
        f f f f f f
        f f f f f f
        f f f f f f
        f f f f f f
    `;
    export let emptyImage = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export let lImage = img`
        1 1 1 1
        1 1 1 1
        1 1 1 1
        1 1 1 1
    `;
    export let card = img`
        11111111111111
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        1ffffffffffff1
        11111111111111
    `;
}

namespace gameUtils {
    export let facing = "";
    export let canInput = true;
    export let hx = 0;
    export let hy = 0;
    export let isPaused = false;

    export function clearMenu() {
        for (let value of menu.menuSprites) {
            sprites.destroy(value);
         //   if (hyacinth.isDevelopmentEnvironment(true)) console.log(value.id + " was cleared successfully!");
        }
    }
    
    forever(function () {
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            gameUtils.facing = "left";
        });

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            gameUtils.facing = "right";
        });

        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            gameUtils.facing = "down";
        });

        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            gameUtils.facing = "up";
        });
    });
}

namespace inventory {
    let heldItem: Items = null;
    let readout: Sprite = sprites.create(gameAssets.emptyImage, SpriteKind.VisualEffect);
    let readoutCard: Sprite = sprites.create(gameAssets.card, SpriteKind.VisualEffect);


    readout.z = -3;

    export enum Items {
        TEST,
        MAGI,
        SWRD
    }

    export function getItem(): Items {
        return heldItem;
    }

    export function setItem(newItem: Items) {
        heldItem = newItem;
    }

    export function parseItemToString(value: Items): string {
        let result = "";

        switch(heldItem) {
            case (Items.TEST): {
                result = "tests";
                break;
            }

            case (Items.MAGI): {
                result = "magic";
                break;
            }

            case (Items.SWRD): {
                result = "sword";
                break;
            }
        }

        return result;
    }

    export function iterateItems(): void {
        let result: Items;

        switch (heldItem) {
            case (Items.TEST): {
                result = Items.MAGI;
                break;
            }

            case (Items.MAGI): {
                result = Items.SWRD;
                break;
            }

            case (Items.SWRD): {
                result = Items.TEST;
                break;
            }
        }

        heldItem = result;
        scene.cameraShake(1.5, 200);
    }

    export function useItem(item: Items, sprite: Sprite): void {
        switch(item) {
            case (Items.TEST): {

                break;
            }

            case (Items.MAGI): {
                let shockwave = sprites.create(img`
                    .....222222222.....
                    ...22.........22...
                    ..2.............2..
                    .2...............2.
                    .2...............2.
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    2.................2
                    .2...............2.
                    .2...............2.
                    ..2.............2..
                    ...22.........22...
                    .....222222222.....
                `, SpriteKind.Projectile);
                shockwave.setPosition(sprite.x, sprite.y);

                shockwave.lifespan = 120;

                break;
            }

            case (Items.SWRD): {
                
                break;
            }
        }

        console.log("Used: " + parseItemToString(item));
    }

    forever( function () {
        readout.setPosition(145, 40);
        readout.sayText(parseItemToString(getItem()), Infinity, false, 1, 15);

        readoutCard.setPosition(readout.x, readout.y + 50);
    });
}

namespace levels {
    let currentLevel = 0;

    export function throwLevel(lvl: number, sprite: Sprite) {
        levelCaches.getAndSetLevel(lvl);

        let x;
        let y;

        switch(lvl) {
            case (0): {
                x = 4;
                y = 4;
            }
        }

        tiles.placeOnTile(sprite, tiles.getTileLocation(x, y));
    }

    export function getLevel(): number {
        return currentLevel;
    }

    namespace levelCaches {
        export function getAndSetLevel(lvl:number) {
            if (lvl == 0) {
              tiles.setCurrentTilemap(tilemap`level1`);
              // 4, 4
            }
        }
    }
}

namespace gameScript {
    hyacinth.setDeveloper(true);

    export function bootstrap() {
        gameUtils.canInput = false;
        gameUtils.hx = 100;
        gameUtils.hy = 100;

        color.pauseUntilFadeDone();
        gameUtils.clearMenu();
        scene.setBackgroundColor(15);

        pause(1000);
        color.startFade(color.Black, color.originalPalette, 1000);
        color.pauseUntilFadeDone();
        pause(500);

        let player = sprites.create(gameAssets.playerImage, SpriteKind.Player);
        player.setPosition(hyacinth.centerScreenX, hyacinth.centerScreenY);
        gameUtils.canInput = true;
        inventory.setItem(inventory.Items.TEST);

        levels.throwLevel(0, player);
        
        forever(function () {
            controller.moveSprite(player, gameUtils.hx, gameUtils.hy);

            controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
                if (gameUtils.canInput) {
                    inventory.iterateItems();
                }
            });

            controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                if (gameUtils.canInput) {
                    inventory.useItem(inventory.getItem(), player);
                }
            });
        });
    }
}