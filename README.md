# Quickbass
```
         ________        .__        __   ___.                                  
         \_____  \  __ __|__| ____ |  | _\_ |__ _____    ______ ______         
  ______  /  / \  \|  |  \  |/ ___\|  |/ /| __ \\__  \  /  ___//  ___/  ______ 
 /_____/ /   \_/.  \  |  /  \  \___|    < | \_\ \/ __ \_\___ \ \___ \  /_____/ 
         \_____\ \_/____/|__|\___  >__|_ \|___  (____  /____  >____  >         
                \__>             \/     \/    \/     \/     \/     \/          
```

## So far, it's a drum machine

It's also a bit of a misnomer, but I couldn't resist the pun on Quickbasic. It runs in the browser. It won't do much on mobile. You need a keyboard. The mouse doesn't do anything (other than the first click, you'll see). That's the world I want to live in. 

## How do I use it?

1. Click somewhere in the window to get focus. That's the only time you'll need a mouse.
2. Hit the p key to start playing. A randomised pattern will start. It will be horrible.
3. Hold down shift key (wow, see how the options changed?) and press c. That cleared the pattern.
4. Using the arrow keys, move around in the Edit window grid. If you're unfamiliar with step sequencers, the rows are the various drum sounds, and the columns are the subdivisions of the bar. Hit space to toggle each step between on and off. Program something that sounds good to your ears. 
5. Hit the d key. That duplicated the pattern. You now have a new pattern. The editing window (the bottom half of the screen) will show this new pattern (let's call it pattern 2), but the top half will still show pattern 1. In this way, we can see which pattern is playing, while editing a different pattern. Rejoice.
6. Make some changes to this pattern. A slightly different kick pattern, maybe? Some more open hats? Great. Any variation will do. When you're happy with it, hold down shift and press 2. The next time pattern 1 finishes, pattern 2 will start. You can keep editing it while it plays, or hit 1 to switch editing back to pattern 1. Or duplicate pattern 2 again to make a third pattern, or start over with a blank pattern in slot 3 by hitting the n key. 
7. Wouldn't it be musical to play the first pattern a few times, and then the second pattern, and keep repeating those over and over? Yes. And wouldn't it be great if you didn't have to manually keep telling it to do so? Yes. That's why I added the Queue feature. Press q. A prompt will inform you that we're in queuing mode. Press numbers to queue patterns; let's go with 1 1 1 2. Press enter. Now it will play that sequence of patterns on repeat. Now we're getting somewhere.
8. Want to mute the kick drum for a while? Of course you do. Everyone does. Use the arrows to go move up to the kick drum row. Press m. Move down to something else. Mute that too. You can unmute each one by pressing m again, or unmute them all at once by holding shift and pressing m.

## Thanks
- to [this](http://patorjk.com/software/taag/) ASCII art generator, the first one I found via Google