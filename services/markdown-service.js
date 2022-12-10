"use strict"

export default class MarkDownService {

  constructor() {
    
    if (MarkDownService._instance) {
      return MarkDownService._instance;
    }
    MarkDownService._instance = this;

  }

  static instance() {
    return MarkDownService._instance || new MarkDownService();
  }


  markdownToHtml(markdown) {
    let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
    .replace(/\*(.*)\*/gim, '<i>$1</i>'); // italic text
	return html; // using trim method to remove whitespace   
  }
}