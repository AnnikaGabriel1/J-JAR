//Import##########################################################
//################################################################
//Export##########################################################
//variables_____________________________________________________
export const el = css => document.querySelector(css);
export const group = css => document.querySelectorAll(css);
export const create = html => document.createElement(html);
export const loadHTML   = async url => (await fetch(url)).text();