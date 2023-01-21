# streamscope
visualise streams of data through a websocket

## 21st Jan 2023

So I'd like to make a tool that runs in the browser. As a user, you give it a websocket URL, and get a little particle stream of points, where each particle represents an event in the websoccket. 

The screen will be divided it up into vertical sections, and we'll be able to select what each section does to the particle, relative to data in the event. So for example, one section could change the colour of the particle, one could affect its velocity, another its direction and so on. 

Now, I've very little clue how to actually achieve this, so it's going to be a journey of discovery that I thought I might blog about in this README. Work and family is such that this is quite possibly going to be rather stop-start, so it will be helpful to me to remember where I got to each session, and what I was thinking about next.

I've just made the initial commit for the repo with a barebones little demo. Here's where we're at:
* I'm using THREE.js, which is very approachable.
* I'm consuming the hatnote wikipedia edits websocket, my favourite websocket for a decade or so now.
* For each new event in the socket i add an element to the dots array and add a "point" to the "scene".
* For every tick of the animation I update the x position of each dot so it moves over the page.
* Depending on the "action" field of the hatnote event, i make a different "material" for the dot, which means I get a different colour dot for different types of wikipedia edits. 

So now, if you server up `index.html` you'll get a bunch of little dots shooting across the screen as people edit wikipedia. Not a bad start!

There are a few huge things to do before this is anywhere near what's going on in my head, though, that I need to figure out.

1. I need things to happen to the points within the different sections of the screen. The idea is that it's kinda like an oscilloscope, with fields acting on the particles but only in the bounds of each section. 
2. I need to make each section have some sort of dropdown menu, so you can chose what kind of transformation (though I'm not gonna do anything other than colour for ages i reckon) each section applies, and which field of the JSON it uses to apply it.
3. I need to learn a lot more about THREE.js and quite specifically how to free up memory. Right now, all my little particles, with their Materials and presumably a bunch of stuff I don't understand are all just hiding off to one side of the screen, so my page's memory usage is steadily increasing with every new wikipedia edit. Which is probably not great practice!

Anyway, gonna leave it here and commit this update.

![streamscope screenshot](screenshots/streamscope_screenshot_210123.png?raw=true)