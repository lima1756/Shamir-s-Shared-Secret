# Shamir's secret sharing

## Index

* [Introduction](#Introduction)
* [Description](#Description)
* [Getting Started](#Getting-Started)
* [How to use](#How-to-use)
* [Limitations](#Limitations)

## Introduction

The Shamir's Secret Sharing is a cryptographic scheme to save a secret and share it between an N number of participants, where if at least K of them get together (k <= n) then, the secret can be obtained.

## Description

### How it works

This application encrypts a file through a random generated numeric key, and with a randomly generated polynomial f(x), where f(0)=numeric key, creates the different shared values. And as mention in the introduction, when at least K participants get together is possible to reconstruct the numeric key (with Lagrange's interpolation method) and decrypt the file.

### Supported encryption and decryption files

At the moment of writing this, it has been tested to support:

* Text files: TXT, code files (.js, .html, .java, etc.)
* Image files: JPG, PNG
* DOC
* PDF

It DOESN'T supports:

* MP4

### Technologies

The present project is an application developed with Javascript with NodeJS, Electron, Electron-Forge, and ReactJS, MathJS. These tools were decided because the facility they give to build multiplatform desktop applications.

## Getting Started

### Prerequisites

* [Node + NPM](https://nodejs.org/en/download/)
* [Electron + Forge](https://electronforge.io/)

### Installation

* Open terminal and move to the root of the project folder.
* Execute `npm install`.

### Execution in development mode

* Execute in terminal `electron-forge start`
* I will automatically open the project window

### Make platform distributable

> Only for the platform where you run the command

* Execute in terminal `electron-forge make`

> If you want to make the distributable for more than the current platform, you can run the command on CI, see more [here](https://electronforge.io/cli/make).

## How to use

After opening the distributable or executing in development mode, you can encrypt or decrypt files. For the numeric inputs, it's recommended to use the keyboard arrow keys (up, down) to change the value.

### Encrypt

1. If you are not already in the first tab, select it (the encode tab).
2. Input the total parts of the key that you need.
3. Input the required number of participants to decrypt the file.
4. Select the file to encrypt.
5. Click the "Generate" button

After all this, your file will be ready on the same location as the original but with an appended extension ".enc" And you will see the different parts for each participant on screen.

### Decrypt

1. Select the second tab (Decode tab)
2. Input the required number of participants to decrypt the file
3. Select the encrypted file (with the other tab).
4. (OPTIONAL) If you want the decrypted file to have another name, you can input the new name (if the original file still exists in the same location it will overwrite it)
5. Input all the necessary parts from each participant in the text boxes.
6. Click the "Generate" button

If the keys were correct, then your file will be at the same location as the encrypted one, with the new name in case you did step 4.

## Limitations

* 2<=Total keys<=50
* 2<=Required keys<=9  && Required keys<=Total keys