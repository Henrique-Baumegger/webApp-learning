const heading = document.querySelector("h1"); // querySelector takes a CSS selector — "#" for id, "." for class, bare tag name for element
heading.addEventListener("click", function() {
    heading.textContent = "You jonkled!!!"; // textContent property of the Node interface represents the text content of the node
});


const btn = document.querySelector('#fetch-btn');
const joke_list = document.querySelector('#joke-output-list');

btn.addEventListener('click', async () => { // async marks this function as asynchronous — allows await inside
    const response = await fetch('https://official-joke-api.appspot.com/random_joke'); // await pauses this function until the Promise resolves — does NOT block the browser
    const finished_json = await response.json(); // body arrives as a stream — separate await needed to read and parse it fully
    const formatted_text = finished_json.setup + ' ... ' + finished_json.punchline; // object properties accessed with dot notation

    const our_new_element = document.createElement("li"); // creates element (which is a subtype of Node) in memory — not in the DOM yet

    // textContent is a Node property — accessed here via the Element object through inheritance
    our_new_element.textContent = formatted_text;

    joke_list.appendChild(our_new_element); // only now does it appear on the page
});


/*
    NODE VS ELEMENT

    The DOM tree is made of Nodes — the base type for everything in the tree.
    There are several node types:
        Element nodes   — actual HTML tags (<p>, <li>, <div> etc.)
        Text nodes      — the raw text inside an element ("Le jonk")
        Comment nodes   — <!-- like this -->

    Element is a subtype of Node — all Elements are Nodes, but not all Nodes are Elements.
    This is why some properties live on Node (textContent, parentNode, childNodes)
    and others live on Element (id, classList, getAttribute) — they belong to different levels of the hierarchy.

    In practice: querySelector() returns an Element.
    You rarely interact with raw text or comment nodes directly.
    When something is missing from Element, check Node — it's probably there.

    MDN reference: https://developer.mozilla.org/en-US/docs/Web/API/Node
                   https://developer.mozilla.org/en-US/docs/Web/API/Element
*/



/* TO REACT:

- Vanilla JS — you manage the DOM
data changes → you find every affected DOM node → you update each one

- React — you manage the data
data changes → React re-renders → DOM is always a reflection of your data

In React, UI is a pure function of state. Same data in, same UI out, always. You never touch the DOM directly.
*/
