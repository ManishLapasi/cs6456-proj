# Project - Note taking app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

CS6456 Project idea => building a note taking app which works by recognizing hand signs from a camera. 

Each hand sign corresponds to a different command that can be used.

The idea is that vision algorithms have evolved to a point where we can start exploring using any combination of hand signs to detect and accept commands, and can progress beyond swipe gestures to gestures at a distance without specialised tools (think: apple vision pro, with more hand gestures).

## Pre-requisites:

- [ ] `npm`
- [ ] `nodejs`

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the packages necessary to run the app

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Intended functionality

Here are a list of functionalities we plan to implement:

### General

- [x] Camera output display
- [x] Show confidence score
- [x] Pop-up toast box for "Delete" option
- [x] Handedness - left hand only, since only model 1 is used
- [ ] `Add-on` Extract gesture-to-input mapping to a separate file to make it easier to edit when necessary
- [x] Explore possibility of using 2 models, for different functionalities

### Preview Mode

- [x] Switch between notes to preview
- [x] New note, Duplicate current note, Delete current note

### Note Mode

- [x] Download Note
- [x] `Add-on` Handedness - left hand for model 1, right hand for model 2
- [x] Recognize letters and type them into note at current cursor position
- [x] Recognize `space` and `delete`
- [ ] `Add-on` Have a way to navigate through note quickly - like going to end of current line, end of current paragraph, or end of current note
- [x] `Add-on` Showcase confidence score when possible - for example when typing letters, if the letter is recognized with low confidence, show it in red/yellow etc.
- [ ] `Add-on` Undo/Redo ?