import {play} from "./client";

document.getElementById("play-button").onclick = () => play(document.getElementById("username").value);