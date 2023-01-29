# streamscope
visualise streams of data through a websocket

## 29th Jan 2023

So I've spent most of the morning trying to make three-mesh-ui work, in the hope I could use it to tag each particle with a data driven label. The library itself seems great, totally got it to work, but not with an Orthographic camera! Pretty sure it's supposed to be for VR UIs where I imagine an orthographic camera would make you fall over and puke etc. So the plane I'm trying to render just sorta disappears.

So now I'm having a go with Three.js' TextGeometry. Main concern is that the examples use it for fun spinny 3d text objects, which isn't really what I want. Let's see, though. The other big problem with this bit of Three.js is that it means I can no longer import the js as a static file like it was 2003, i gotta use `npm` and start mucking about with webpack etc which normally spells the death of my projects (though I refuse to let this one perish!) or at the very least cracking on with a basic refactor. Can hear movement upstairs so my remaining time might almost be up, hence the log with no other commit today.

Remaining:

* figure out how to free up memory
* think about how to interrogate particles
* figure out coordinate frames (though mucking about with the camera today has helped)
* better menus
* refactor and move to npm + webpack. 
* Ditch "bearing" for "force" and model a teensy bit of mass of the particles just for nice curves..
* stabilise particles after each section crossing

## 28th Jan 2023

Woke up early. Gonna do menus. No clue how.

So it turns out there's a library called `dat.gui` which I've used to explore how we might control what each section does. The code I've written is honestly terrible, I'm just copying and pasting into switch cases at this point to see what can be done - pretty quickly approaching the point where the code's going to need to be refactored! Anyway, playing with menus and a bit of interaction has made a couple of other things clear:

* I think maybe the "stabilise" idea from the last session should be applied when the particles exit each section. The idea being that a particle moves to the right horizontally unless it's being modified explicitly. That way we won't need to spend space on levelling out the particles. I think this might limit opportunities for combining things, so could possibly be revisitng. 
* I made a new modifer called "force". I didn't implement it properly (e.g. there's no acceleration or anything) but I'm going to use it to replace "bearing" which really didn't fit the metaphor at all. I'll do this as a refactor, i think.
* `dat.gui` is VERY quick to use and very handy for mucking about. It also rapidly becomes obvious that we'll need to a) autosuggest fields in the data, have dropdowns for different kinds of modifiers, and be able to normalise values somehow so i don't have to fiddle around with tiny values. So still a long way to go on the menu.

Ideas remainging from the last session, and chats over the week on Mastodon:

* figure out how to free up memory
* think about how to interrogate the particles
* figure out coordinate frames so I can do better labelling

![streamscope screenshot](screenshots/streamscope_screenshot_280123.png?raw=true)


## 22nd Jan 2023

Today I'm trying to figure out how to apply a transform to each particle in a specific section of the screen. The transform is that I'd like to change its colour. 

Even this simple transform highlights the need that I should attach the data to the particle in the `dots` array, so that it's available to the sections as the dot traverses the screen. 

I woke up late, and my family sounds like it might be waking up early, so this could be a pretty short session...

... OK so I got a bit further than I had thought. I've made two "sections" - thoroughly hard coded mind you - one changes the bearing of the particle and one changes the colour. Quick thoughts on the transformation:
* the colour change is fine, and occurs immediately as you cross into the section. Keep feeling like something more should happen at the border crossing, like a little ding! glow or something. The borders don't feel very physical. 
* the bearing change I achieve by simply changing the amount that's added to `position.y` at every step. Following the physical analogy feels like it might be nicer to apply a force to the particle during its stay in the section, such that its bearing is changed a bit during the rest of its time on the screen. 

New thoughts:
* even with just these two little hard coded transformations the tool is starting to do part of its job in the sense that I want to know more about the data as it flows across the screen. The tool right now does a terrible job at letting you find stuff out. Going to need to think about some section options that help you look into the data a bit more, like a "label" section or something. 
* could be fun to have an offset section, which is essentially the bearing section where the `dy` is set back to 0 as you cross out of the section. I quite want to map longitude of the wiki edits to a vertical axis of streamscope. Does beg the question about how to represent the sections not just as fields but as border crossings. Or should we have a section that is a sort of "stabilise" field, that takes the bearing and sets it back to zero again? Actually I might do that now....

Turns out the stabilise idea is qutie nice; again could make it a field that applies a force such that by the end of the field the `dy = 0` and that would loook a lot better. To implement the longitude idea now I'd create a bearing field that spreads the particles apart by longitude and then a stabilise field that sets the bearing back to 0.

On implementing this new field (actually the CSS for positioning its label) it strikes me that I don't understand the coordinate system of any of the stuff on the screen. We've got a sort of absolute coordinate sytem which the vertical lines follow (I think (0,0) is maybe in the middle of the screen? I forget), the coordinates the particles follow which seem to be relative to their starting position, and then pixel coordinates I'm using in the CSS to position the section labels. #TODO. 

Outstanding tasks carried over from yesterday:
* make a menu; let the user choose the nature of each field
* figure out how to free up memory

![streamscope screenshot](screenshots/streamscope_screenshot_220123.png?raw=true)

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