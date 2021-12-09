# monote.app

Monote is a web app developed with React, Next.js and Firebase to store and retrieve lists of notes depending on the logged in user.
I made this app to better keep track of what I'm working on and what my friends are working on without having to use over-complicated work-note-collaboration software. I wanted to create something easily understandable and comprehensible to anyone who wants to keep track of their lists and view others' online.

The purpose of developing this app is to practice and demonstrate my abilities to create full stack web applications with server-side rendering and an object oriented database.

To use this app, simply navigate to https://www.monote.app/ and sign in using Google OAuth. After setting an available display name, you're ready to start adding notes.

## List of known bugs/future features:
**Bugs:**

~~#1: If navigated to another user's list, and the "My Lists" button is pressed under the profile dropdown, the user's first available list is not automatically rendered. Instead, the user must manually navigate to one of their lists.~~

~~#2: In mobile mode, pressing the "Add List" button when no lists are added should slide out the drawer, and autofocus to the add list input~~


**Future Features:**

~~#1: Mobile interface. Currently, the website is barely viewable on mobile. In the future, styling will be added such that list content will take up the whole screen on mobile, and different lists can be selected/created by tapping on a drawer icon to view a seperate menu.~~

~~#2: *List renaming*. Currently, lists cannot be renamed and must be deleted and recreated if there is a typo.~~

~~#3: *Note content editting*. Similar to list renaming, this is not currently possible and the note must be deleted if the content must be changed.~~

~~#4: *Sub-Note deletion*. Sub-notes cannot yet be deleted. This is an easy fix, I simply haven't gotten around to the problem yet.~~

#5: *List privating*. Lists should be able to be kept private if the user wishes for them to be. Meaning, the only viewer of the list can be the creator, and not site visitors.

#6: *Note details*. Under list notes should contain small light text depicting when the note was created/editted.

The content of both the bugs and features should be addressed in the order they're written, starting with the bugs.
