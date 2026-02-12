namespace menuAssets {
    export let button = img`
        1111111111111111
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1ffffffffffffff1
        1111111111111111
    `;
    export let emp = img`
        f
    `;
    export let cur = img`
        1 1 1 1
        1 1 1 1
        1 1 1 1
        1 1 1 1
    `;
}

let globalGameActive = false;

namespace menu {
    // const
    const cardSpacing = 20;
    const followSpeed = 100;
    const cursorOffset = 7;
    const selectOffset = 15;

    // other
    export let menuSprites: Sprite[] = [];
    let curPos = 1;

    let active = false; // true = game active, false = game inactive
    let canInteract = false;
    let onStandby = false;
    let v = false;

    // menu
    let b1 = sprites.create(menuAssets.button, SpriteKind.MenuElement);
    let b2 = sprites.create(menuAssets.button, SpriteKind.MenuElement);
    let cu = sprites.create(menuAssets.cur, SpriteKind.MenuElement);

    // anims
    let fo1 = sprites.create(menuAssets.emp, SpriteKind.Placeholder);
    let fo2 = sprites.create(menuAssets.emp, SpriteKind.Placeholder);
    let cu2 = sprites.create(menuAssets.emp, SpriteKind.Placeholder);

    for (let value of sprites.allOfKind(SpriteKind.MenuElement)) {
        menuSprites.push(value);
        value.z = 1;
    }

    for (let value of sprites.allOfKind(SpriteKind.Placeholder)) {
        menuSprites.push(value);
        value.z = -1;
    }

    b1.follow(fo1, followSpeed);
    b2.follow(fo2, followSpeed);
    cu.follow(cu2, followSpeed);

    fo1.setPosition(10, 119);
    fo2.setPosition(fo1.x + cardSpacing, fo1.y);
    cu2.setPosition(fo1.x, fo1.y - 15);

    b1.setPosition(10, 119);
    b2.setPosition(fo1.x + cardSpacing, fo1.y);
    cu.setPosition(fo1.x, fo1.y - 15);

    // listeners
    forever(function () {
        if (!active) {
            controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
                if (!active) {
                    if (canInteract) {
                        if (curPos == 1) {
                            curPos = 2;
                        }
                    }
                }
            });

            controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
                if (!active) {
                    if (canInteract) {
                        if (curPos == 2) {
                            curPos = 1;
                        }
                    }
                }
            });

            controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                if (!v) {
                    if (!onStandby) {
                        if (canInteract) {
                            let c = null;
                            active = true;

                            if (curPos == 1) c = fo1;
                            if (curPos == 2) c = fo2;

                            onStandby = true;
                            c.setPosition(c.x, c.y - 15);
                            scene.cameraShake(1.5, 200);
                        }
                    } else {
                        let c = null;
                        active = false;

                        if (curPos == 1) c = fo1;
                        if (curPos == 2) c = fo2;

                        onStandby = false;
                        c.setPosition(c.x, c.y + 15);
                        scene.cameraShake(1.5, 200);
                    }
                }
            });

            controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
                if (onStandby) {


                    let b;
                    if (curPos == 1) b = fo1;
                    if (curPos == 2) b = fo2;

                    cu.follow(cu2, 0);
                    animation.runMovementAnimation(cu, animation.animationPresets(animation.bobbing), 2000, false);
                    b.setPosition(hyacinth.centerScreenX, hyacinth.centerScreenY);
                    color.startFade(color.White, color.originalPalette, 500);
                    scene.cameraShake(2, 500);
                    pause(1000);
                    color.startFadeFromCurrent(color.Black);
                    recievers.register();
                }
            });

            if (cu.overlapsWith(cu2)) {
                canInteract = true;
            } else {
                canInteract = false;
            }
        }

        if (curPos == 1) {
            cu2.setPosition(b1.x, b1.y - selectOffset);
        }

        if (curPos == 2) {
            cu2.setPosition(b2.x, b2.y - selectOffset);
        }
    });
}