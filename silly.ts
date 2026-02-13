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
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    `;
}

namespace gameUtils {
    export let facing = "";
    export let parsedPlayer: Sprite;
    export let canInput = true;
    export let hx = 0;
    export let hy = 0;
    export let shakeIntensity = 0;

    export enum Events {
        ATTACK
    }

    export function clearMenu() {
        for (let value of menu.menuSprites) {
            sprites.destroy(value);
            if (hyacinth.isDevelopmentEnvironment(true)) console.log(value.id + " was cleared successfully!");
        }
    }

    export function parsePlayer() {
        let finalValue;
        for (let c of sprites.allOfKind(SpriteKind.Player)) {
            finalValue = c;
        }

        parsedPlayer = finalValue;
    }

    export function input(event: Events, target: Sprite) {
        
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

    forever( function () {
        scene.cameraShake(shakeIntensity, 40);
        info.setScore(shakeIntensity);
    });
}

namespace inventory {
    let heldItem: Items = null;
    let readout: Sprite = sprites.create(gameAssets.emptyImage, SpriteKind.VisualEffect);
    readout.z = -3;

    export enum Items {
        TEST
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
                result = "test";
            }
        }

        return result;
    }

    forever( function () {
        readout.setPosition(30, 30);
        readout.sayText(parseItemToString(getItem()), Infinity, false, 15, 1);
    });
}

namespace gameScript {
    hyacinth.setDeveloper(true);

    export function bootstrap() {
        gameUtils.canInput = false;
        gameUtils.hx = 100;
        gameUtils.hy = 100;

        color.pauseUntilFadeDone();
        gameUtils.clearMenu();
        scene.setBackgroundColor(1);

        pause(1000);
        color.startFade(color.Black, color.originalPalette, 1000);
        color.pauseUntilFadeDone();
        pause(500);

        let player = sprites.create(gameAssets.playerImage, SpriteKind.Player);
        player.setPosition(hyacinth.centerScreenX, hyacinth.centerScreenY);
        gameUtils.canInput = true;
        inventory.setItem(inventory.Items.TEST);
        scene.cameraFollowSprite(player);

        forever(function () {
//            player.sayText(inventory.parseItemToString(inventory.getItem()));

            controller.moveSprite(player, gameUtils.hx, gameUtils.hy);

            controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                if (gameUtils.canInput) {
                    gameUtils.input(gameUtils.Events.ATTACK, player);
                }
            });
        });
    }
}