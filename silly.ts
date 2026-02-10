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
        }

        if (hyacinth.isDevelopmentEnvironment(true)) {
            console.log(proceed + ": game ready.");
        }
    }
}

namespace gameAssets {

}

namespace gameUtils {
    export function clearMenu() {
        for (let value of menu.menuSprites) {
            sprites.destroy(value);
            if (hyacinth.isDevelopmentEnvironment(true)) console.log(value.id + " was cleared successfully!");
        }
    }
}

namespace gameScript {
    export function bootstrap() {
        gameUtils.clearMenu();
    }
}