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
    export function clearMenu() {
        for (let value of menu.menuSprites) {
            sprites.destroy(value);
            if (hyacinth.isDevelopmentEnvironment(true)) console.log(value.id + " was cleared successfully!");
        }
    }

    export let facing = "";

    export function parsePlayer() {
        let finalValue;
        for (let c of sprites.allOfKind(SpriteKind.Player)) {
            finalValue = c;
        }

        parsedPlayer = finalValue;
    }

    export let parsedPlayer: Sprite;

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
    export function bootstrap() {
        let xSpeed = 100;
        let ySpeed = 100;

        color.pauseUntilFadeDone();
        gameUtils.clearMenu();
        scene.setBackgroundColor(1);

        pause(1000);
        color.startFade(color.Black, color.originalPalette, 1000);
        color.pauseUntilFadeDone();
        pause(500);

        let player = sprites.create(gameAssets.playerImage, SpriteKind.Player);
        player.setPosition(hyacinth.centerScreenX, hyacinth.centerScreenY);



        forever(function () {
            player.sayText(gameUtils.facing);

            controller.moveSprite(player, xSpeed, ySpeed);
        });
    }
}