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
}

namespace gameUtils {
    export let facing = "";
    export let parsedPlayer: Sprite;
    export let canInput = true;

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
        if (event == Events.ATTACK) {
            let addX: number;
            let addY: number;
            let offset = 10;
            switch (facing) {
                case ("down"): {
                    addX = 0;
                    addY = offset;
                    break;
                }

                case ("up"): {
                    addX = 0;
                    addY = -offset;
                    break;
                }

                case ("left"): {
                    addX = -offset;
                    addY = 0;
                    break;
                }

                case ("right"): {
                    addX = offset;
                    addY = 0;
                    break;
                }
            }

            let finalX: number = target.x + addX;
            let finalY: number = target.y + addY;

            let goober = sprites.create(img`
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
            `, SpriteKind.Placeholder);
            goober.setPosition(finalX, finalY);
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

namespace gameScript {
    hyacinth.setDeveloper(true);

    export function bootstrap() {
        let xSpeed = 100;
        let ySpeed = 100;
        gameUtils.canInput = false;

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

        forever(function () {
            player.sayText(gameUtils.facing);

            controller.moveSprite(player, xSpeed, ySpeed);

            controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                if (gameUtils.canInput) {
                    gameUtils.input(gameUtils.Events.ATTACK, player);
                }
            });
        });
    }
}